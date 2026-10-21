import { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import type { ClothingCategory } from "../../types/clothing";

type Props = {
  visible: boolean;
  categories: ClothingCategory[];
  onClose: () => void;
  onAddCategory: (name: string) => void;
  onRenameCategory: (id: string, name: string) => void;
  onAddSubcategory: (categoryId: string, name: string) => void;
  onRenameSubcategory: (
    categoryId: string,
    subcategoryId: string,
    name: string,
  ) => void;
  onDeleteSubcategory: (categoryId: string, subcategoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
};

export default function CategoryManagementScreen({
  visible,
  categories,
  onClose,
  onAddCategory,
  onRenameCategory,
  onAddSubcategory,
  onRenameSubcategory,
  onDeleteSubcategory,
  onDeleteCategory,
}: Props) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingName, setEditingName] = useState("");

  const [addingSubcategoryTo, setAddingSubcategoryTo] = useState<string | null>(
    null,
  );
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [editingSubcategory, setEditingSubcategory] = useState<{
    categoryId: string;
    subcategoryId: string;
  } | null>(null);
  const [editingSubcategoryName, setEditingSubcategoryName] = useState("");

  function isDuplicateCategoryName(name: string, currentId?: string) {
    return categories.some(
      (category) =>
        category.id !== currentId &&
        category.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );
  }

  function isDuplicateSubcategoryName(
    categoryId: string,
    name: string,
    currentId?: string,
  ) {
    const category = categories.find((item) => item.id === categoryId);

    return (
      category?.subcategories.some(
        (subcategory) =>
          subcategory.id !== currentId &&
          subcategory.name.trim().toLowerCase() === name.trim().toLowerCase(),
      ) ?? false
    );
  }

  function addCategory() {
    const name = newCategoryName.trim();

    if (!name) {
      Alert.alert(
        "Nama belum diisi",
        "Masukkan nama kategori terlebih dahulu.",
      );
      return;
    }

    if (isDuplicateCategoryName(name)) {
      Alert.alert("Kategori sudah ada", "Gunakan nama kategori yang berbeda.");
      return;
    }

    onAddCategory(name);
    setNewCategoryName("");
  }

  function startEditingCategory(category: ClothingCategory) {
    setEditingCategoryId(category.id);
    setEditingName(category.name);
  }

  function saveCategoryName() {
    const name = editingName.trim();

    if (!editingCategoryId) return;

    if (!name) {
      Alert.alert("Nama belum diisi", "Nama kategori tidak boleh kosong.");
      return;
    }

    if (isDuplicateCategoryName(name, editingCategoryId)) {
      Alert.alert("Kategori sudah ada", "Gunakan nama kategori yang berbeda.");
      return;
    }

    onRenameCategory(editingCategoryId, name);
    setEditingCategoryId(null);
    setEditingName("");
  }

  function addSubcategory(categoryId: string) {
    const name = newSubcategoryName.trim();

    if (!name) {
      Alert.alert(
        "Nama belum diisi",
        "Masukkan nama subkategori terlebih dahulu.",
      );
      return;
    }

    if (isDuplicateSubcategoryName(categoryId, name)) {
      Alert.alert(
        "Subkategori sudah ada",
        `"${name}" sudah terdaftar dalam kategori ini. Gunakan nama lain.`,
      );
      return;
    }

    onAddSubcategory(categoryId, name);
    setNewSubcategoryName("");
    setAddingSubcategoryTo(null);

    Alert.alert("Berhasil", `Subkategori "${name}" berhasil ditambahkan.`);
  }

  function startEditingSubcategory(
    categoryId: string,
    subcategoryId: string,
    name: string,
  ) {
    setEditingSubcategory({ categoryId, subcategoryId });
    setEditingSubcategoryName(name);
    setAddingSubcategoryTo(null);
  }

  function saveSubcategoryName() {
    if (!editingSubcategory) return;

    const { categoryId, subcategoryId } = editingSubcategory;
    const name = editingSubcategoryName.trim();

    if (!name) {
      Alert.alert("Nama belum diisi", "Nama subkategori tidak boleh kosong.");
      return;
    }

    if (isDuplicateSubcategoryName(categoryId, name, subcategoryId)) {
      Alert.alert(
        "Subkategori sudah ada",
        "Gunakan nama subkategori yang berbeda dalam kategori ini.",
      );
      return;
    }

    onRenameSubcategory(categoryId, subcategoryId, name);
    setEditingSubcategory(null);
    setEditingSubcategoryName("");
  }

  function confirmDeleteSubcategory(
    categoryId: string,
    subcategoryId: string,
    name: string,
  ) {
    const message = `Subkategori "${name}" akan dihapus. Tindakan ini tidak bisa dibatalkan.`;

    if (Platform.OS === "web") {
      const confirmed = window.confirm(message);

      if (confirmed) {
        onDeleteSubcategory(categoryId, subcategoryId);
      }

      return;
    }

    Alert.alert("Hapus subkategori?", message, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => onDeleteSubcategory(categoryId, subcategoryId),
      },
    ]);
  }

  function confirmDeleteCategory(category: ClothingCategory) {
    const message =
      `Kategori "${category.name}" akan dihapus jika tidak sedang ` +
      "digunakan oleh pakaian.";

    if (Platform.OS === "web") {
      if (window.confirm(message)) {
        onDeleteCategory(category.id);
      }
      return;
    }

    Alert.alert("Hapus kategori?", message, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => onDeleteCategory(category.id),
      },
    ]);
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-[#F8F7F2]">
        <View className="flex-row items-center justify-between border-b border-[#E8E7E0] px-5 pb-4 pt-14">
          <View>
            <Text className="text-xs font-bold uppercase tracking-widest text-[#858B83]">
              PENGATURAN
            </Text>
            <Text className="mt-1 text-2xl font-extrabold text-[#26352C]">
              Kelola kategori
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
          >
            <Text className="text-xl text-[#344C3D]">×</Text>
          </Pressable>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        >
          <Text className="mb-4 text-sm leading-6 text-[#858B83]">
            Buat kategori dan subkategori sesuai kebutuhanmu. Kategori bawaan
            tetap dilindungi dari penghapusan permanen.
          </Text>

          <View className="mb-5 rounded-2xl border border-[#DCE6D8] bg-white p-4">
            <Text className="mb-3 font-bold text-[#26352C]">
              Tambah kategori
            </Text>

            <TextInput
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="Contoh: Pakaian olahraga"
              placeholderTextColor="#A5AAA2"
              maxLength={60}
              returnKeyType="done"
              onSubmitEditing={addCategory}
              className="rounded-xl border border-[#E8E7E0] bg-[#F8F7F2] px-4 py-3 text-sm text-[#26352C]"
            />

            <Pressable
              accessibilityRole="button"
              onPress={addCategory}
              className="mt-3 items-center rounded-xl bg-[#344C3D] px-4 py-3"
            >
              <Text className="font-bold text-white">+ Tambah kategori</Text>
            </Pressable>
          </View>

          {categories.map((category) => {
            const isEditing = editingCategoryId === category.id;
            const isAddingSubcategory = addingSubcategoryTo === category.id;

            return (
              <View
                key={category.id}
                className="mb-3 rounded-2xl border border-[#E8E7E0] bg-white p-4"
              >
                <View className="mb-3 flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="font-bold text-[#26352C]">
                      {category.name}
                    </Text>
                    <Text className="mt-1 text-xs text-[#858B83]">
                      {category.subcategories.length} subkategori
                    </Text>
                  </View>

                  <View className="ml-2 rounded-full bg-[#DCE6D8] px-2 py-1">
                    <Text className="text-xs text-[#344C3D]">
                      {category.isDefault ? "Bawaan" : "Kustom"}
                    </Text>
                  </View>
                </View>

                {isEditing ? (
                  <View>
                    <TextInput
                      autoFocus
                      value={editingName}
                      onChangeText={setEditingName}
                      placeholder="Nama kategori"
                      placeholderTextColor="#A5AAA2"
                      maxLength={60}
                      returnKeyType="done"
                      onSubmitEditing={saveCategoryName}
                      className="rounded-xl border border-[#DCE6D8] bg-[#F8F7F2] px-4 py-3 text-sm text-[#26352C]"
                    />

                    <View className="mt-3 flex-row gap-2">
                      <Pressable
                        accessibilityRole="button"
                        onPress={saveCategoryName}
                        className="flex-1 items-center rounded-xl bg-[#344C3D] px-3 py-3"
                      >
                        <Text className="font-bold text-white">Simpan</Text>
                      </Pressable>

                      <Pressable
                        accessibilityRole="button"
                        onPress={() => {
                          setEditingCategoryId(null);
                          setEditingName("");
                        }}
                        className="flex-1 items-center rounded-xl bg-[#F0F1E9] px-3 py-3"
                      >
                        <Text className="font-bold text-[#344C3D]">Batal</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => startEditingCategory(category)}
                    className="self-start rounded-full border border-[#DCE6D8] px-4 py-2"
                  >
                    <Text className="text-xs font-semibold text-[#344C3D]">
                      Ubah nama kategori
                    </Text>
                  </Pressable>
                )}

                <Pressable
                  accessibilityRole="button"
                  onPress={() => confirmDeleteCategory(category)}
                  className="mt-2 self-start rounded-full bg-[#FCE8E6] px-4 py-2"
                >
                  <Text className="text-xs font-semibold text-[#A33A32]">
                    Hapus kategori
                  </Text>
                </Pressable>

                <View className="mt-4">
                  <Text className="mb-2 text-sm font-bold text-[#26352C]">
                    Subkategori
                  </Text>

                  {category.subcategories.map((subcategory) => {
                    const isEditingThisSubcategory =
                      editingSubcategory?.categoryId === category.id &&
                      editingSubcategory.subcategoryId === subcategory.id;

                    return (
                      <View
                        key={subcategory.id}
                        className="mb-2 rounded-xl bg-[#F8F7F2] p-3"
                      >
                        {isEditingThisSubcategory ? (
                          <>
                            <TextInput
                              autoFocus
                              value={editingSubcategoryName}
                              onChangeText={setEditingSubcategoryName}
                              placeholder="Nama subkategori"
                              placeholderTextColor="#A5AAA2"
                              maxLength={60}
                              returnKeyType="done"
                              onSubmitEditing={saveSubcategoryName}
                              className="rounded-xl border border-[#DCE6D8] bg-white px-3 py-2 text-sm text-[#26352C]"
                            />

                            <View className="mt-2 flex-row gap-2">
                              <Pressable
                                accessibilityRole="button"
                                onPress={saveSubcategoryName}
                                className="rounded-lg bg-[#344C3D] px-3 py-2"
                              >
                                <Text className="text-xs font-bold text-white">
                                  Simpan
                                </Text>
                              </Pressable>

                              <Pressable
                                accessibilityRole="button"
                                onPress={() => {
                                  setEditingSubcategory(null);
                                  setEditingSubcategoryName("");
                                }}
                                className="rounded-lg bg-white px-3 py-2"
                              >
                                <Text className="text-xs font-semibold text-[#344C3D]">
                                  Batal
                                </Text>
                              </Pressable>
                            </View>
                          </>
                        ) : (
                          <View className="flex-row items-center justify-between gap-2">
                            <Text className="flex-1 text-sm text-[#526A56]">
                              {subcategory.name}
                            </Text>

                            <View className="flex-row gap-2">
                              <Pressable
                                accessibilityRole="button"
                                onPress={() =>
                                  startEditingSubcategory(
                                    category.id,
                                    subcategory.id,
                                    subcategory.name,
                                  )
                                }
                                className="rounded-lg bg-white px-3 py-2"
                              >
                                <Text className="text-xs font-semibold text-[#344C3D]">
                                  Ubah
                                </Text>
                              </Pressable>

                              <Pressable
                                accessibilityRole="button"
                                onPress={() =>
                                  confirmDeleteSubcategory(
                                    category.id,
                                    subcategory.id,
                                    subcategory.name,
                                  )
                                }
                                className="rounded-lg bg-[#FCE8E6] px-3 py-2"
                              >
                                <Text className="text-xs font-semibold text-[#A33A32]">
                                  Hapus
                                </Text>
                              </Pressable>
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  })}

                  {isAddingSubcategory ? (
                    <View className="mt-2 rounded-xl border border-[#DCE6D8] p-3">
                      <TextInput
                        autoFocus
                        value={newSubcategoryName}
                        onChangeText={setNewSubcategoryName}
                        placeholder="Contoh: Kemeja flanel"
                        placeholderTextColor="#A5AAA2"
                        maxLength={60}
                        returnKeyType="done"
                        onSubmitEditing={() => addSubcategory(category.id)}
                        className="rounded-xl border border-[#E8E7E0] bg-[#F8F7F2] px-3 py-3 text-sm text-[#26352C]"
                      />

                      <View className="mt-2 flex-row gap-2">
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => addSubcategory(category.id)}
                          className="rounded-lg bg-[#344C3D] px-3 py-2"
                        >
                          <Text className="text-xs font-bold text-white">
                            Tambahkan
                          </Text>
                        </Pressable>

                        <Pressable
                          accessibilityRole="button"
                          onPress={() => {
                            setAddingSubcategoryTo(null);
                            setNewSubcategoryName("");
                          }}
                          className="rounded-lg bg-[#F0F1E9] px-3 py-2"
                        >
                          <Text className="text-xs font-semibold text-[#344C3D]">
                            Batal
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        setAddingSubcategoryTo(category.id);
                        setNewSubcategoryName("");
                        setEditingSubcategory(null);
                      }}
                      className="mt-2 self-start rounded-full border border-dashed border-[#A8B9A3] px-4 py-2"
                    >
                      <Text className="text-xs font-semibold text-[#344C3D]">
                        + Tambah subkategori
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}
