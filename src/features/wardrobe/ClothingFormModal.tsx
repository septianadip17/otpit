import { useEffect, useState } from "react";
import type {
  ClothingCategory,
  ClothingCategoryId,
  ClothingItem,
} from "../../types/clothing";
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
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

import ActionButton from "../../components/ActionButton";
import ClothingPhoto from "../../components/ClothingPhoto";

export type FormPhoto = {
  uri: string;
  isNew: boolean;
};

export type ClothingFormData = {
  name: string;
  categoryId: ClothingCategoryId;
  subcategoryId: string;
  color: string;
  notes: string;
  photos: FormPhoto[];
  photosChanged: boolean;
};

export const INITIAL_FORM: ClothingFormData = {
  name: "",
  categoryId: "tops",
  subcategoryId: "t-shirt",
  color: "",
  notes: "",
  photos: [],
  photosChanged: false,
};

type Props = {
  visible: boolean;
  item: ClothingItem | null;
  categories: ClothingCategory[];
  onClose: () => void;
  onSave: (
    form: ClothingFormData,
    editingId: string | null,
  ) => Promise<void>;
};

export default function ClothingFormModal({
  visible,
  item,
  categories,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<ClothingFormData>(INITIAL_FORM);
  const [error, setError] = useState("");
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;

    setError("");
    setIsSaving(false);

    setForm(
      item
        ? {
          name: item.name,
          categoryId: item.categoryId,
          subcategoryId: item.subcategoryId,
          color: item.color,
          notes: item.notes,
          photos: (item.imageUris?.length
            ? item.imageUris
            : item.imageUri
              ? [item.imageUri]
              : []
          ).map((uri) => ({
            uri,
            isNew: false,
          })),
          photosChanged: false,
        }
        : INITIAL_FORM,
    );
  }, [visible, item]);

  const selectedCategory = categories.find(
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
    const category = categories.find(
      (entry) => entry.id === form.categoryId,
    );

    setForm((current) => ({
      ...current,
      categoryId,
      subcategoryId: category?.subcategories[0]?.id ?? "",
    }));
  }

  async function pickImage() {
    try {
      setError("");

      if (Platform.OS !== "web") {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
          setError("Izinkan akses galeri agar kamu bisa memilih foto pakaian.");
          return;
        }
      }

      setIsPickingImage(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: false,
        quality: 1,
      });
      if (form.photos.length >= 3) {
        setError("Maksimal 3 foto untuk setiap barang.");
        return;
      }

      const asset = result.assets?.[0];

      if (!asset) return;
      const longestSide = Math.max(asset.width, asset.height);
      const actions =
        longestSide > 1200
          ? [
            {
              resize:
                asset.width >= asset.height
                  ? { width: 1200 }
                  : { height: 1200 },
            },
          ]
          : [];

      const compressed = await ImageManipulator.manipulateAsync(
        asset.uri,
        actions,
        {
          compress: 0.78,
          format: ImageManipulator.SaveFormat.JPEG,
        },
      );

      setForm((current) => {
        if (current.photos.length >= 3) {
          return current;
        }

        return {
          ...current,
          photos: [
            ...current.photos,
            {
              uri: compressed.uri,
              isNew: true,
            },
          ],
          photosChanged: true,
        };
      });
    } catch {
      setError("Foto gagal diproses. Coba pilih gambar lain.");
    } finally {
      setIsPickingImage(false);
    }
  }

  function removePhoto(index: number) {
    setForm((current) => ({
      ...current,
      photos: current.photos.filter((_, i) => i !== index),
      photosChanged: true,
    }));
  }

  async function submit() {
    if (isSaving || isPickingImage) return;

    if (!form.name.trim()) {
      setError("Nama barang wajib diisi.");
      return;
    }

    const category = categories.find(
      (entry) => entry.id === form.categoryId,
    );

    const subcategory = category?.subcategories.find(
      (entry) => entry.id === form.subcategoryId,
    );

    if (!category || !subcategory) {
      setError("Pilih kategori dan subkategori yang valid.");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      await onSave(
        {
          ...form,
          name: form.name.trim(),
          color: form.color.trim(),
          notes: form.notes.trim(),
        },
        item?.id ?? null,
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Barang gagal disimpan. Coba lagi.",
      );
    } finally {
      setIsSaving(false);
    }
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
              disabled={isSaving}
              className="h-10 w-10 items-center justify-center rounded-full border border-[#E8E7E0] bg-white"
            >
              <Text className="text-xl text-[#344C3D]">×</Text>
            </Pressable>
          </View>

          <View className="mb-5 rounded-2xl border border-[#E8E7E0] bg-white p-4">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-sm font-bold text-[#26352C]">
                Foto pakaian
              </Text>
              <Text className="text-xs text-[#858B83]">
                {form.photos.length}/3 foto
              </Text>
            </View>

            <View className="h-56 overflow-hidden rounded-2xl bg-[#F0F1E9]">
              <ClothingPhoto
                imageUri={form.photos[0]?.uri ?? null}
                fallbackEmoji="📷"
              />
            </View>

            {form.photos.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, paddingVertical: 12 }}
              >
                {form.photos.map((photo, index) => (
                  <View
                    key={`${photo.uri}-${index}`}
                    className="h-20 w-20 overflow-hidden rounded-xl border border-[#DCE6D8]"
                  >
                    <ClothingPhoto imageUri={photo.uri} resizeMode="cover" />

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Hapus foto ${index + 1}`}
                      disabled={isSaving || isPickingImage}
                      onPress={() => removePhoto(index)}
                      className="absolute right-1 top-1 h-6 w-6 items-center justify-center rounded-full bg-[#26352C]/90"
                    >
                      <Text className="font-bold text-white">×</Text>
                    </Pressable>

                    {index === 0 ? (
                      <View className="absolute bottom-0 left-0 right-0 bg-[#344C3D]/90 py-1">
                        <Text className="text-center text-[9px] font-bold text-white">
                          UTAMA
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ))}
              </ScrollView>
            ) : null}

            {form.photos.length < 3 ? (
              <ActionButton
                label={
                  isPickingImage
                    ? "Memproses foto..."
                    : form.photos.length === 0
                      ? "Pilih foto dari galeri"
                      : " + Tambah foto"
                }
                onPress={() => void pickImage()}
                secondary
              />
            ) : (
              <Text className="py-3 text-center text-xs text-[#858B83]">
                Batas 3 foto sudah tercapai.
              </Text>
            )}

            <Text className="mt-2 text-xs leading-5 text-[#858B83]">
              Foto pertama menjadi foto utama. Foto akan diperkecil otomatis
              untuk menghemat ruang penyimpanan.
            </Text>
          </View>

          {/* Informasi barang */}
          <View className="mb-5 rounded-2xl border border-[#E8E7E0] bg-white p-4">
            <Text className="mb-3 text-sm font-bold text-[#26352C]">
              Informasi barang
            </Text>

            {/* Nama */}
            <Text className="mb-2 text-xs font-semibold text-[#858B83]">
              Nama barang *
            </Text>
            <TextInput
              value={form.name}
              onChangeText={(value) => update("name", value)}
              placeholder="Contoh: Kaos putih polos"
              placeholderTextColor="#A5AAA2"
              editable={!isSaving}
              maxLength={100}
              className="mb-5 rounded-xl border border-[#E8E7E0] bg-[#F8F7F2] px-4 py-3 text-sm text-[#26352C]"
            />

            {/* Kategori */}
            <Text className="mb-3 text-xs font-semibold text-[#858B83]">
              Kategori *
            </Text>
            <View className="mb-5 flex-row flex-wrap gap-2">
              {categories.map((category) => {
                const isSelected = form.categoryId === category.id;

                return (
                  <Pressable
                    key={category.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    disabled={isSaving}
                    onPress={() => changeCategory(category.id)}
                    className={`rounded-full border px-4 py-2 ${isSelected
                        ? "border-[#344C3D] bg-[#344C3D]"
                        : "border-[#DCE6D8] bg-white"
                      }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${isSelected ? "text-white" : "text-[#344C3D]"
                        }`}
                    >
                      {category.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Subkategori */}
            <Text className="mb-3 text-xs font-semibold text-[#858B83]">
              Subkategori *
            </Text>
            <View className="mb-5 flex-row flex-wrap gap-2">
              {subcategories.map((subcategory) => {
                const isSelected = form.subcategoryId === subcategory.id;

                return (
                  <Pressable
                    key={subcategory.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    disabled={isSaving}
                    onPress={() => update("subcategoryId", subcategory.id)}
                    className={`rounded-full border px-3 py-2 ${isSelected
                        ? "border-[#9DB59A] bg-[#DCE6D8]"
                        : "border-[#E8E7E0] bg-white"
                      }`}
                  >
                    <Text className="text-xs font-medium text-[#344C3D]">
                      {subcategory.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Warna */}
            <Text className="mb-2 text-xs font-semibold text-[#858B83]">
              Warna
            </Text>
            <TextInput
              value={form.color}
              onChangeText={(value) => update("color", value)}
              placeholder="Contoh: Putih, hitam, navy"
              placeholderTextColor="#A5AAA2"
              editable={!isSaving}
              maxLength={100}
              className="mb-5 rounded-xl border border-[#E8E7E0] bg-[#F8F7F2] px-4 py-3 text-sm text-[#26352C]"
            />

            {/* Catatan */}
            <Text className="mb-2 text-xs font-semibold text-[#858B83]">
              Catatan (opsional)
            </Text>
            <TextInput
              value={form.notes}
              onChangeText={(value) => update("notes", value)}
              placeholder="Contoh: Cocok untuk acara santai"
              placeholderTextColor="#A5AAA2"
              editable={!isSaving}
              multiline
              maxLength={500}
              textAlignVertical="top"
              className="min-h-24 rounded-xl border border-[#E8E7E0] bg-[#F8F7F2] px-4 py-3 text-sm text-[#26352C]"
            />
          </View>

          {error ? (
            <Text className="mb-4 text-sm font-semibold text-[#9A5146]">
              {error}
            </Text>
          ) : null}

          <ActionButton
            label={
              isSaving
                ? "Menyimpan..."
                : item
                  ? "Simpan perubahan"
                  : "Simpan ke lemari"
            }
            onPress={() => void submit()}
          />

          <View className="mt-3">
            <ActionButton label="Batal" secondary onPress={onClose} />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}