
import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  visible: boolean;
  itemCount: number;
  onClose: () => void;
};

export default function ProfileModal({
  visible,
  itemCount,
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
        <View className="rounded-t-3xl bg-[#F8F7F2] p-6 pb-10">
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-2xl font-extrabold text-[#26352C]">
              Profil & pengaturan
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-white"
            >
              <Text className="text-xl text-[#344C3D]">×</Text>
            </Pressable>
          </View>

          <View className="mb-5 rounded-2xl bg-[#DCE6D8] p-5">
            <Text className="text-xs font-bold uppercase tracking-widest text-[#526A56]">
              WARDROBE JOURNAL
            </Text>
            <Text className="mt-2 text-xl font-bold text-[#344C3D]">
              Koleksi kamu
            </Text>
            <Text className="mt-1 text-sm text-[#526A56]">
              {itemCount} barang tersimpan di perangkat ini
            </Text>
          </View>

          <View className="rounded-2xl border border-[#E8E7E0] bg-white p-4">
            <Text className="font-bold text-[#26352C]">Ekspor data</Text>
            <Text className="mt-1 text-sm leading-5 text-[#858B83]">
              Ekspor CSV yang bisa dibuka di Excel akan kita tambahkan
              setelah fitur inti MVP stabil.
            </Text>
          </View>

          <Text className="mt-4 text-center text-xs leading-5 text-[#858B83]">
            Otpit menyimpan koleksi secara lokal. Akun dan sinkronisasi
            cloud belum diperlukan untuk MVP.
          </Text>
        </View>
      </View>
    </Modal>
  );
}
