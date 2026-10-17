
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { CLOTHING_CATEGORIES } from "../../constants/categories";
import {
  CATEGORY_EMOJIS,
  CATEGORY_LABELS,
  SUBCATEGORY_EMOJIS,
} from "../../constants/wardrobe";
import type {
  ClothingCategoryId,
  ClothingItem,
} from "../../types/clothing";
import ActionButton from "../../components/ActionButton";

type Props = {
  items: ClothingItem[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (item: ClothingItem) => void;
  onDelete: (item: ClothingItem) => void;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function WardrobeScreen({
  items,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    ClothingCategoryId | "all"
  >("all");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const category = CLOTHING_CATEGORIES.find(
        (entry) => entry.id === item.categoryId,
      );

      const subcategory = category?.subcategories.find(
        (entry) => entry.id === item.subcategoryId,
      );

      const matchesCategory =
        activeCategory === "all" ||
        item.categoryId === activeCategory;

      const text = [
        item.name,
        item.color,
        item.notes,
        category?.name,
        subcategory?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && text.includes(query);
    });
  }, [items, search, activeCategory]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 28 }}
    >
      <View className="mx-auto w-full max-w-5xl px-5 pb-5 pt-5 md:px-10">
        <View className="mb-8 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-extrabold tracking-tight text-[#344C3D]">
              otpit.
            </Text>
            <Text className="mt-0.5 text-xs text-[#858B83]">
              Lemari digital kamu
            </Text>
          </View>
        </View>

        <View className="mb-6 mt-2">
          <Text className="text-xs font-bold uppercase tracking-[3px] text-[#858B83]">
            YOUR PERSONAL WARDROBE
          </Text>
          <Text className="mt-3 text-3xl font-extrabold leading-10 tracking-tight text-[#26352C]">
            Lemari kamu,{"\n"}lebih tertata.
          </Text>
          <Text className="mt-3 max-w-md text-sm leading-6 text-[#777C72]">
            Semua yang kamu punya, tertata rapi dalam satu tempat.
          </Text>
        </View>

        <View className="rounded-3xl bg-[#344C3D] p-6">
          <Text className="text-[11px] font-bold uppercase tracking-[2px] text-[#D4E0D2]">
            KOLEKSI SAYA
          </Text>
          <Text className="mt-2 text-4xl font-extrabold text-white">
            {items.length}
            <Text className="text-base font-medium text-[#D4E0D2]">
              {" "}barang
            </Text>
          </Text>
          <Text className="mt-2 text-sm leading-5 text-[#E0E7DD]">
            {items.length === 0
              ? "Mulai dengan menambahkan barang pertamamu."
              : "Setiap barang punya tempatnya sendiri."}
          </Text>

          <View className="my-5 h-px bg-[#607566]" />

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs text-[#D4E0D2]">
                Kategori tersedia
              </Text>
              <Text className="mt-1 text-lg font-bold text-white">
                {CLOTHING_CATEGORIES.length}
              </Text>
            </View>
            <ActionButton label="+ Tambah barang" onPress={onAdd} />
          </View>
        </View>

        <View className="mb-4 mt-9 flex-row items-end justify-between">
          <View>
            <Text className="text-2xl font-extrabold tracking-tight text-[#26352C]">
              Lemari saya
            </Text>
            <Text className="mt-1 text-sm text-[#858B83]">
              Temukan koleksi favoritmu.
            </Text>
          </View>
          <Text className="pb-1 text-sm font-semibold text-[#777C72]">
            {filteredItems.length} item
          </Text>
        </View>

        <View className="flex-row items-center rounded-2xl border border-[#E8E7E0] bg-white px-4">
          <Text className="mr-3 text-lg text-[#858B83]">⌕</Text>
          <TextInput
            accessibilityLabel="Cari koleksi"
            className="min-h-12 flex-1 py-3 text-sm text-[#26352C]"
            placeholder="Cari nama, warna, kategori..."
            placeholderTextColor="#92948D"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Hapus pencarian"
              onPress={() => setSearch("")}
              className="p-2"
            >
              <Text className="font-semibold text-[#858B83]">×</Text>
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          contentContainerStyle={{ gap: 8, paddingBottom: 3 }}
        >
          <Pressable
            onPress={() => setActiveCategory("all")}
            className={`rounded-full border px-4 py-2.5 ${
              activeCategory === "all"
                ? "border-[#344C3D] bg-[#344C3D]"
                : "border-[#E3E4DB] bg-white"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeCategory === "all"
                  ? "text-white"
                  : "text-[#646B61]"
              }`}
            >
              Semua
            </Text>
          </Pressable>

          {CLOTHING_CATEGORIES.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => setActiveCategory(category.id)}
              className={`rounded-full border px-4 py-2.5 ${
                activeCategory === category.id
                  ? "border-[#344C3D] bg-[#344C3D]"
                  : "border-[#E3E4DB] bg-white"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  activeCategory === category.id
                    ? "text-white"
                    : "text-[#646B61]"
                }`}
              >
                {CATEGORY_LABELS[category.id]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {isLoading ? (
          <View className="items-center rounded-3xl border border-[#E8E7E0] bg-white px-6 py-14">
            <ActivityIndicator size="large" color="#344C3D" />
            <Text className="mt-4 text-sm text-[#858B83]">
              Memuat koleksi...
            </Text>
          </View>
        ) : filteredItems.length === 0 ? (
          <View className="mt-5 items-center rounded-3xl border border-[#E8E7E0] bg-white px-6 py-10">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-[#F0F1E9]">
              <Text className="text-4xl">
                {search || activeCategory !== "all" ? "⌕" : "👕"}
              </Text>
            </View>
            <Text className="text-center text-lg font-bold text-[#26352C]">
              {search || activeCategory !== "all"
                ? "Barang tidak ditemukan"
                : "Lemari masih kosong"}
            </Text>
            <Text className="mt-2 max-w-xs text-center text-sm leading-6 text-[#858B83]">
              {search || activeCategory !== "all"
                ? "Coba kata kunci atau kategori yang berbeda."
                : "Mulai dengan menambahkan satu barang yang sering kamu pakai."}
            </Text>

            {search || activeCategory !== "all" ? (
              <View className="mt-5">
                <ActionButton
                  label="Reset pencarian dan filter"
                  secondary
                  onPress={() => {
                    setSearch("");
                    setActiveCategory("all");
                  }}
                />
              </View>
            ) : (
              <View className="mt-5">
                <ActionButton
                  label="+ Tambah barang pertama"
                  onPress={onAdd}
                />
              </View>
            )}
          </View>
        ) : (
          <View className="mt-5 flex-row flex-wrap justify-between">
            {filteredItems.map((item) => {
              const category = CLOTHING_CATEGORIES.find(
                (entry) => entry.id === item.categoryId,
              );
              const subcategory = category?.subcategories.find(
                (entry) => entry.id === item.subcategoryId,
              );

              return (
                <View
                  key={item.id}
                  className="mb-4 w-[48%] overflow-hidden rounded-2xl border border-[#E8E7E0] bg-white"
                >
                  <View className="aspect-square items-center justify-center bg-[#F0F1E9]">
                    <Text className="text-6xl">
                      {SUBCATEGORY_EMOJIS[item.subcategoryId] ??
                        CATEGORY_EMOJIS[item.categoryId] ??
                        "📦"}
                    </Text>
                    <View className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1">
                      <Text className="text-[10px] font-bold text-[#344C3D]">
                        {CATEGORY_LABELS[item.categoryId]}
                      </Text>
                    </View>
                  </View>

                  <View className="p-3">
                    <Text
                      numberOfLines={1}
                      className="text-sm font-bold text-[#26352C]"
                    >
                      {item.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      className="mt-1 text-xs text-[#858B83]"
                    >
                      {subcategory?.name ?? "Barang lainnya"}
                    </Text>

                    {item.color ? (
                      <Text
                        numberOfLines={1}
                        className="mt-2 text-xs text-[#646B61]"
                      >
                        {item.color}
                      </Text>
                    ) : null}

                    <View className="mt-3 flex-row gap-2">
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => onEdit(item)}
                        className="flex-1 items-center rounded-lg bg-[#F0F1E9] py-2"
                      >
                        <Text className="text-xs font-bold text-[#344C3D]">
                          Edit
                        </Text>
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => onDelete(item)}
                        className="items-center rounded-lg border border-[#E8E7E0] px-3 py-2"
                      >
                        <Text className="text-xs font-bold text-[#9A5146]">
                          Hapus
                        </Text>
                      </Pressable>
                    </View>

                    <Text className="mt-3 text-[10px] text-[#A0A198]">
                      Ditambahkan {formatDate(item.createdAt)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View className="mb-3 mt-6 h-px bg-[#E8E7E0]" />
        <Text className="text-center text-xs text-[#92948D]">
          Otpit · Semua koleksi, satu lemari.
        </Text>
      </View>
    </ScrollView>
  );
}
