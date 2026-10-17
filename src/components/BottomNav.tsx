
import { Pressable, Text, View } from "react-native";

export type TabName = "wardrobe" | "explore" | "statistics";

type Props = {
  activeTab: TabName;
  onNavigate: (tab: TabName) => void;
  onAdd: () => void;
};

export default function BottomNav({
  activeTab,
  onNavigate,
  onAdd,
}: Props) {
  const tabs: {
    id: "wardrobe" | "explore" | "statistics";
    icon: string;
    label: string;
  }[] = [
    { id: "wardrobe", icon: "👕", label: "Lemari" },
    { id: "explore", icon: "⌕", label: "Jelajahi" },
    { id: "statistics", icon: "▥", label: "Statistik" },
  ];

  return (
    <View className="flex-row items-center justify-around border-t border-[#E8E7E0] bg-white px-2 pb-5 pt-3">
      {tabs.slice(0, 2).map((tab) => (
        <Pressable
          key={tab.id}
          accessibilityRole="button"
          onPress={() => onNavigate(tab.id)}
          className="min-w-16 items-center gap-1 py-1"
        >
          <Text className="text-xl">{tab.icon}</Text>
          <Text
            className={`text-xs ${
              activeTab === tab.id
                ? "font-bold text-[#344C3D]"
                : "text-[#858B83]"
            }`}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Tambah barang"
        onPress={onAdd}
        className="min-w-16 items-center gap-1"
      >
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#344C3D]">
          <Text className="text-2xl font-medium text-white">+</Text>
        </View>
        <Text className="text-xs font-semibold text-[#344C3D]">
          Tambah
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={() => onNavigate("statistics")}
        className="min-w-16 items-center gap-1 py-1"
      >
        <Text className="text-xl">▥</Text>
        <Text
          className={`text-xs ${
            activeTab === "statistics"
              ? "font-bold text-[#344C3D]"
              : "text-[#858B83]"
          }`}
        >
          Statistik
        </Text>
      </Pressable>
    </View>
  );
}
