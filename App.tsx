import { useEffect, useState } from "react";
import CategoryManagementScreen from "./src/features/categories/CategoryManagementScreen";
import { loadCategories, saveCategories } from "./src/services/categoryStorage";
import {
  Alert,
  Pressable,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
  Platform,
} from "react-native";
import "./global.css";

import { CLOTHING_CATEGORIES } from "./src/constants/categories";
import {
  loadClothingItems,
  saveClothingItems,
} from "./src/services/clothingStorage";
import {
  saveClothingImage,
  deleteClothingImage,
} from "./src/services/clothingImageStorage";
import type {
  ClothingCategory,
  ClothingItem,
  ClothingSubcategory,
} from "./src/types/clothing";

import ActionButton from "./src/components/ActionButton";
import BottomNav, { type TabName } from "./src/components/BottomNav";
import ClothingFormModal, {
  type ClothingFormData,
} from "./src/features/wardrobe/ClothingFormModal";
import WardrobeScreen from "./src/features/wardrobe/WardrobeScreen";
import ProfileModal from "./src/features/profile/ProfileModal";
import StatisticsModal from "./src/features/statistics/StatisticsModal";

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [items, setItems] = useState<ClothingItem[]>([]);
  const [categories, setCategories] = useState<ClothingCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<ClothingItem | null>(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>("wardrobe");
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const [hasLoadedCategories, setHasLoadedCategories] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [savedItems, savedCategories] = await Promise.all([
          loadClothingItems(),
          loadCategories(),
        ]);

        if (mounted) {
          setItems(savedItems);
          setCategories(savedCategories);
          setHasLoadedCategories(true);
        }
      } catch {
        if (mounted) {
          Alert.alert(
            "Data belum bisa dimuat",
            "Penyimpanan lokal tidak dapat dibaca. Coba buka ulang aplikasi.",
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedCategories) return;

    void saveCategories(categories).catch(() => {
      Alert.alert(
        "Gagal menyimpan kategori",
        "Perubahan kategori belum berhasil disimpan ke perangkat.",
      );
    });
  }, [categories, hasLoadedCategories]);

  function openAddForm() {
    setEditingItem(null);
    setIsFormVisible(true);
  }

  function openEditForm(item: ClothingItem) {
    setEditingItem(item);
    setIsFormVisible(true);
  }

  async function handleSave(
    form: ClothingFormData,
    editingId: string | null,
  ): Promise<void> {
    const now = new Date().toISOString();

    const existingItem = editingId
      ? items.find((entry) => entry.id === editingId)
      : undefined;

    const previousPhotos = Array.from(
      new Set([
        ...(existingItem?.imageUris ?? []),
        ...(existingItem?.imageUri ? [existingItem.imageUri] : []),
      ]),
    );

    let imageUris = previousPhotos;
    const newlySavedImageUris: string[] = [];

    if (form.photosChanged) {
      imageUris = [];

      try {
        for (const photo of form.photos) {
          if (photo.isNew) {
            const savedUri = await saveClothingImage(photo.uri, createId());

            newlySavedImageUris.push(savedUri);
            imageUris.push(savedUri);
          } else {
            imageUris.push(photo.uri);
          }
        }
      } catch {
        await Promise.all(
          newlySavedImageUris.map((uri) =>
            deleteClothingImage(uri).catch(() => undefined),
          ),
        );

        throw new Error("Sebagian foto gagal disimpan. Coba pilih foto lagi.");
      }
    }

    const imageUri = imageUris[0] ?? null;

    let nextItems: ClothingItem[];

    if (editingId) {
      nextItems = items.map((entry) =>
        entry.id === editingId
          ? {
              ...entry,
              name: form.name,
              categoryId: form.categoryId,
              subcategoryId: form.subcategoryId,
              color: form.color,
              notes: form.notes,
              imageUri,
              imageUris,
              updatedAt: now,
            }
          : entry,
      );
    } else {
      const newItem: ClothingItem = {
        id: createId(),
        name: form.name,
        categoryId: form.categoryId,
        subcategoryId: form.subcategoryId,
        color: form.color,
        notes: form.notes,
        imageUri,
        imageUris,
        createdAt: now,
        updatedAt: now,
      };

      nextItems = [newItem, ...items];
    }

    try {
      await saveClothingItems(nextItems);
    } catch {
      await Promise.all(
        newlySavedImageUris.map((uri) =>
          deleteClothingImage(uri).catch(() => undefined),
        ),
      );

      throw new Error("Barang gagal disimpan. Coba lagi.");
    }

    setItems(nextItems);
    setIsFormVisible(false);
    setEditingItem(null);

    // Bersihkan foto yang sudah dilepas dari barang setelah metadata
    // berhasil tersimpan. Foto yang masih dipakai tidak ikut dihapus.
    const retainedPhotos = new Set(imageUris);

    await Promise.all(
      previousPhotos
        .filter((uri) => !retainedPhotos.has(uri))
        .map((uri) => deleteClothingImage(uri).catch(() => undefined)),
    );
  }

  async function confirmDelete() {
    if (!deleteItem) return;

    const itemToDelete = deleteItem;
    const nextItems = items.filter((entry) => entry.id !== itemToDelete.id);

    try {
      await saveClothingItems(nextItems);
      setItems(nextItems);
      setDeleteItem(null);

      try {
        const photosToDelete = Array.from(
          new Set([
            ...(itemToDelete.imageUris ?? []),
            ...(itemToDelete.imageUri ? [itemToDelete.imageUri] : []),
          ]),
        );

        await Promise.all(
          photosToDelete.map((uri) => deleteClothingImage(uri)),
        );
      } catch {
        Alert.alert(
          "Barang terhapus",
          "Barang berhasil dihapus, tetapi file foto lama belum berhasil dibersihkan.",
        );
      }
    } catch {
      Alert.alert(
        "Gagal menghapus",
        "Barang belum berhasil dihapus dari penyimpanan.",
      );
    }
  }

  function navigate(tab: TabName) {
    setActiveTab(tab);

    if (tab === "statistics") {
      setIsStatsVisible(true);
    }
  }

  function handleAddCategory(name: string) {
    const category: ClothingCategory = {
      id: createId(),
      name,
      isDefault: false,
      subcategories: [],
    };

    setCategories((current) => [...current, category]);
  }

  function handleRenameCategory(id: string, name: string) {
    setCategories((current) =>
      current.map((category) =>
        category.id === id ? { ...category, name } : category,
      ),
    );
  }

  function handleDeleteCategory(categoryId: string) {
    const category = categories.find((item) => item.id === categoryId);

    if (!category) {
      Alert.alert("Gagal", "Kategori tidak ditemukan.");
      return;
    }

    const hasItems = items.some((item) => item.categoryId === categoryId);
    if (hasItems) {
      const message =
        `Kategori "${category.name}" masih digunakan oleh pakaian. ` +
        "Pindahkan atau hapus semua pakaian dalam kategori ini terlebih dahulu.";

      if (Platform.OS === "web") {
        window.alert(message);
      } else {
        Alert.alert("Kategori masih digunakan", message);
      }

      return;
    }

    setCategories((current) =>
      current.filter((item) => item.id !== categoryId),
    );

    Alert.alert(
      "Kategori berhasil dihapus",
      `Kategori "${category.name}" sudah dihapus.`,
    );
  }

  function handleAddSubcategory(categoryId: string, name: string) {
    const subcategory: ClothingSubcategory = {
      id: createId(),
      name,
    };

    setCategories((current) =>
      current.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              subcategories: [...category.subcategories, subcategory],
            }
          : category,
      ),
    );
  }

  function handleRenameSubcategory(
    categoryId: string,
    subcategoryId: string,
    name: string,
  ) {
    setCategories((current) =>
      current.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              subcategories: category.subcategories.map((subcategory) =>
                subcategory.id === subcategoryId
                  ? { ...subcategory, name }
                  : subcategory,
              ),
            }
          : category,
      ),
    );
  }

  function handleDeleteSubcategory(categoryId: string, subcategoryId: string) {
    const isUsed = items.some(
      (item) =>
        item.categoryId === categoryId && item.subcategoryId === subcategoryId,
    );

    if (isUsed) {
      Alert.alert(
        "Subkategori masih digunakan",
        "Pindahkan pakaian ke subkategori lain atau hapus pakaian tersebut terlebih dahulu.",
      );
      return;
    }

    setCategories((current) =>
      current.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              subcategories: category.subcategories.filter(
                (subcategory) => subcategory.id !== subcategoryId,
              ),
            }
          : category,
      ),
    );
  }

  return (
    <View className="flex-1 bg-[#F8F7F2]">
      <StatusBar barStyle="dark-content" backgroundColor="#F8F7F2" />

      <View className="flex-1">
        <WardrobeScreen
          items={items}
          categories={categories}
          isLoading={isLoading}
          onAdd={openAddForm}
          onEdit={openEditForm}
          onDelete={setDeleteItem}
        />

        <View className="absolute right-5 top-5 z-10">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Buka profil dan pengaturan"
            onPress={() => setIsProfileVisible(true)}
            className="h-11 w-11 items-center justify-center rounded-full border border-[#DCE6D8] bg-[#DCE6D8]"
          >
            <Text className="text-lg font-bold text-[#344C3D]">O</Text>
          </Pressable>
        </View>
      </View>

      {!isDesktop && (
        <BottomNav
          activeTab={activeTab}
          onNavigate={navigate}
          onAdd={openAddForm}
        />
      )}

      <ClothingFormModal
        visible={isFormVisible}
        item={editingItem}
        categories={categories}
        onClose={() => {
          setIsFormVisible(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
      />

      <ProfileModal
        visible={isProfileVisible}
        itemCount={items.length}
        onClose={() => setIsProfileVisible(false)}
        onManageCategories={() => {
          setIsProfileVisible(false);
          setIsCategoriesVisible(true);
        }}
      />

      <CategoryManagementScreen
        visible={isCategoriesVisible}
        categories={categories}
        onClose={() => setIsCategoriesVisible(false)}
        onAddCategory={handleAddCategory}
        onRenameCategory={handleRenameCategory}
        onAddSubcategory={handleAddSubcategory}
        onRenameSubcategory={handleRenameSubcategory}
        onDeleteSubcategory={handleDeleteSubcategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <StatisticsModal
        visible={isStatsVisible}
        items={items}
        onClose={() => {
          setIsStatsVisible(false);
          setActiveTab("wardrobe");
        }}
      />

      {deleteItem && (
        <View className="absolute inset-0 z-20 items-center justify-center bg-black/30 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-[#F8F7F2] p-6">
            <Text className="text-xl font-extrabold text-[#26352C]">
              Hapus barang?
            </Text>
            <Text className="mt-3 text-sm leading-6 text-[#858B83]">
              "{deleteItem.name}" akan dihapus dari koleksi perangkat ini.
            </Text>

            <View className="mt-6 flex-row gap-3">
              <View className="flex-1">
                <ActionButton
                  label="Batal"
                  secondary
                  onPress={() => setDeleteItem(null)}
                />
              </View>

              <View className="flex-1">
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void confirmDelete()}
                  className="items-center justify-center rounded-xl bg-[#9A5146] px-4 py-3"
                >
                  <Text className="text-sm font-bold text-white">Hapus</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
