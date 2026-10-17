
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { CLOTHING_CATEGORIES } from "../../constants/categories";
import type { ClothingItem } from "../../types/clothing";

type Props = {
  visible: boolean;
  items: ClothingItem[];
  onClose: () => void;
};

export default function StatisticsModal({
  visible,
  items,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/30">
        <View className="max-h-[85%] rounded-t-3xl bg-[#F8F7F2] p-6 pb-10">
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-2xl font-extrabold text-[#26352C]">
              Statistik koleksi
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-white"
            >
              <Text className="text-xl text-[#344C3D]">×</Text>
            </Pressable>
          </View>

          <View className="rounded-2xl bg-[#344C3D] p-5">
            <Text className="text-sm text-[#D4E0D2]">Total barang</Text>
            <Text className="mt-1 text-4xl font-extrabold text-white">
              {items.length}
            </Text>
          </View>

          <Text className="mb-3 mt-5 font-bold text-[#26352C]">
            Barang per kategori
          </Text>

          <ScrollView className="shrink">
            {CLOTHING_CATEGORIES.map((category) => {
              const count = items.filter(
                (item) => item.categoryId === category.id,
              ).length;

              if (count === 0) return null;

              return (
                <View
                  key={category.id}
                  className="mb-2 flex-row items-center justify-between rounded-xl bg-white p-4"
                >
                  <Text className="flex-1 text-sm text-[#26352C]">
                    {category.name}
                  </Text>
                  <Text className="font-bold text-[#344C3D]">
                    {count}
                  </Text>
                </View>
              );
            })}

            {items.length === 0 && (
              <Text className="py-5 text-center text-sm text-[#858B83]">
                Tambahkan barang untuk mulai melihat statistik.
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
