
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import "./global.css";

import { CLOTHING_CATEGORIES } from "./src/constants/categories";
import {
  loadClothingItems,
  saveClothingItems,
} from "./src/services/clothingStorage";
import type { ClothingItem } from "./src/types/clothing";

import ActionButton from "./src/components/ActionButton";
import BottomNav, {
  type TabName,
} from "./src/components/BottomNav";
import ClothingFormModal, {
  type ClothingFormData,
} from "./src/features/wardrobe/ClothingFormModal";
import WardrobeScreen from "./src/features/wardrobe/WardrobeScreen";
import ProfileModal from "./src/features/profile/ProfileModal";
import StatisticsModal from "./src/features/statistics/StatisticsModal";

export default function App() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [items, setItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<ClothingItem | null>(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>("wardrobe");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const savedItems = await loadClothingItems();
        if (mounted) setItems(savedItems);
      } catch {
        if (mounted) {
          Alert.alert(
            "Koleksi belum bisa dimuat",
            "Penyimpanan lokal tidak dapat dibaca. Coba buka ulang aplikasi.",
          );
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    void saveClothingItems(items).catch(() => {
      Alert.alert(
        "Gagal menyimpan",
        "Perubahan belum berhasil disimpan ke perangkat.",
      );
    });
  }, [items, isLoading]);

  function openAddForm() {
    setEditingItem(null);
    setIsFormVisible(true);
  }

  function openEditForm(item: ClothingItem) {
    setEditingItem(item);
    setIsFormVisible(true);
  }

  function handleSave(
    form: ClothingFormData,
    editingId: string | null,
  ) {
    const now = new Date().toISOString();

    if (editingId) {
      setItems((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: form.name,
                categoryId: form.categoryId,
                subcategoryId: form.subcategoryId,
                color: form.color,
                notes: form.notes,
                updatedAt: now,
              }
            : item,
        ),
      );
    } else {
      const newItem: ClothingItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: form.name,
        categoryId: form.categoryId,
        subcategoryId: form.subcategoryId,
        color: form.color,
        imageUri: null,
        notes: form.notes,
        createdAt: now,
        updatedAt: now,
      };

      setItems((current) => [newItem, ...current]);
    }

    setIsFormVisible(false);
    setEditingItem(null);
  }

  function confirmDelete() {
    if (!deleteItem) return;

    setItems((current) =>
      current.filter((item) => item.id !== deleteItem.id),
    );
    setDeleteItem(null);
  }

  function navigate(tab: TabName) {
    setActiveTab(tab);

    if (tab === "statistics") {
      setIsStatsVisible(true);
    }
  }

  return (
    <View className="flex-1 bg-[#F8F7F2]">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8F7F2"
      />

      <View className="flex-1">
        <WardrobeScreen
          items={items}
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
      />

      <StatisticsModal
        visible={isStatsVisible}
        items={items}
        onClose={() => {
          setIsStatsVisible(false);
          setActiveTab("wardrobe");
        }}
      />

      {/* Konfirmasi hapus barang */}
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
                  onPress={confirmDelete}
                  className="items-center justify-center rounded-xl bg-[#9A5146] px-4 py-3"
                >
                  <Text className="text-sm font-bold text-white">
                    Hapus
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
