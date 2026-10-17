
import { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

import { CLOTHING_CATEGORIES } from "../../constants/categories";
import type {
  ClothingCategoryId,
  ClothingItem,
} from "../../types/clothing";
import ActionButton from "../../components/ActionButton";

export type ClothingFormData = {
  name: string;
  categoryId: ClothingCategoryId;
  subcategoryId: string;
  color: string;
  notes: string;
};

export const INITIAL_FORM: ClothingFormData = {
  name: "",
  categoryId: "tops",
  subcategoryId: "t-shirt",
  color: "",
  notes: "",
};

type Props = {
  visible: boolean;
  item: ClothingItem | null;
  onClose: () => void;
  onSave: (form: ClothingFormData, editingId: string | null) => void;
};

export default function ClothingFormModal({
  visible,
  item,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<ClothingFormData>(INITIAL_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!visible) return;

    setError("");
    setForm(
      item
        ? {
            name: item.name,
            categoryId: item.categoryId,
            subcategoryId: item.subcategoryId,
            color: item.color,
            notes: item.notes,
          }
        : INITIAL_FORM,
    );
  }, [visible, item]);

  const selectedCategory = CLOTHING_CATEGORIES.find(
    (category) => category.id === form.categoryId,
  );

  const subcategories = selectedCategory?.subcategories ?? [];

  function update<K extends keyof ClothingFormData>(
    key: K,
    value: ClothingFormData[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function changeCategory(categoryId: ClothingCategoryId) {
    const category = CLOTHING_CATEGORIES.find(
      (entry) => entry.id === categoryId,
    );

    setForm((current) => ({
      ...current,
      categoryId,
      subcategoryId: category?.subcategories[0]?.id ?? "",
    }));
  }

  function submit() {
    if (!form.name.trim()) {
      setError("Nama barang wajib diisi.");
      return;
    }

    const category = CLOTHING_CATEGORIES.find(
      (entry) => entry.id === form.categoryId,
    );

    const subcategory = category?.subcategories.find(
      (entry) => entry.id === form.subcategoryId,
    );

    if (!category || !subcategory) {
      setError("Pilih kategori dan subkategori yang valid.");
      return;
    }

    onSave(
      {
        ...form,
        name: form.name.trim(),
        color: form.color.trim(),
        notes: form.notes.trim(),
      },
      item?.id ?? null,
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-[#F8F7F2]">
        <StatusBar barStyle="dark-content" />

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 22,
            paddingTop: Platform.OS === "ios" ? 58 : 28,
            paddingBottom: 40,
          }}
        >
          <View className="mb-7 flex-row items-center justify-between">
            <View>
              <Text className="text-xs font-bold uppercase tracking-[2px] text-[#858B83]">
                WARDROBE JOURNAL
              </Text>
              <Text className="mt-2 text-2xl font-extrabold text-[#26352C]">
                {item ? "Edit barang" : "Barang baru"}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tutup form"
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full border border-[#E8E7E0] bg-white"
            >
              <Text className="text-xl text-[#344C3D]">×</Text>
            </Pressable>
          </View>

          <View className="mb-5 rounded-2xl border border-[#E8E7E0] bg-white p-4">
            <Text className="mb-2 text-sm font-bold text-[#26352C]">
              Nama barang *
            </Text>
            <TextInput
              className="rounded-xl border border-[#E8E7E0] bg-[#FCFBF8] px-4 py-3.5 text-sm text-[#26352C]"
              placeholder="Contoh: Kemeja linen putih"
              placeholderTextColor="#92948D"
              value={form.name}
              onChangeText={(value) => update("name", value)}
              maxLength={80}
              returnKeyType="next"
            />

            <Text className="mb-2 mt-5 text-sm font-bold text-[#26352C]">
              Kategori *
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {CLOTHING_CATEGORIES.map((category) => (
                <Pressable
                  key={category.id}
                  onPress={() => changeCategory(category.id)}
                  className={`rounded-full border px-3 py-2 ${
                    form.categoryId === category.id
                      ? "border-[#344C3D] bg-[#344C3D]"
                      : "border-[#E8E7E0] bg-white"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      form.categoryId === category.id
                        ? "text-white"
                        : "text-[#646B61]"
                    }`}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text className="mb-2 mt-5 text-sm font-bold text-[#26352C]">
              Subkategori *
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {subcategories.map((subcategory) => (
                <Pressable
                  key={subcategory.id}
                  onPress={() => update("subcategoryId", subcategory.id)}
                  className={`rounded-full border px-3 py-2 ${
                    form.subcategoryId === subcategory.id
                      ? "border-[#B6C8B1] bg-[#DCE6D8]"
                      : "border-[#E8E7E0] bg-white"
                  }`}
                >
                  <Text className="text-xs font-semibold text-[#344C3D]">
                    {subcategory.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text className="mb-2 mt-5 text-sm font-bold text-[#26352C]">
              Warna
            </Text>
            <TextInput
              className="rounded-xl border border-[#E8E7E0] bg-[#FCFBF8] px-4 py-3.5 text-sm text-[#26352C]"
              placeholder="Contoh: Putih, navy, hitam"
              placeholderTextColor="#92948D"
              value={form.color}
              onChangeText={(value) => update("color", value)}
              maxLength={40}
              returnKeyType="next"
            />

            <Text className="mb-2 mt-5 text-sm font-bold text-[#26352C]">
              Catatan
            </Text>
            <TextInput
              multiline
              textAlignVertical="top"
              className="min-h-24 rounded-xl border border-[#E8E7E0] bg-[#FCFBF8] px-4 py-3.5 text-sm text-[#26352C]"
              placeholder="Misalnya: cocok untuk acara formal"
              placeholderTextColor="#92948D"
              value={form.notes}
              onChangeText={(value) => update("notes", value)}
              maxLength={500}
            />
          </View>

          {error ? (
            <Text className="mb-4 text-sm font-semibold text-[#9A5146]">
              {error}
            </Text>
          ) : null}

          <ActionButton
            label={item ? "Simpan perubahan" : "Simpan ke lemari"}
            onPress={submit}
          />

          <View className="mt-3">
            <ActionButton
              label="Batal"
              secondary
              onPress={onClose}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
