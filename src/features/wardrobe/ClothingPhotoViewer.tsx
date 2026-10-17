import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

import ClothingPhoto from "../../components/ClothingPhoto";

type Props = {
  visible: boolean;
  title: string;
  photos: string[];
  onClose: () => void;
};

export default function ClothingPhotoViewer({
  visible,
  title,
  photos,
  onClose,
}: Props) {
  const { width, height } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (visible) setActiveIndex(0);
  }, [visible, photos]);

  function handleScrollEnd(
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) {
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / width,
    );

    setActiveIndex(
      Math.max(0, Math.min(nextIndex, photos.length - 1)),
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-[#172019]">
        <StatusBar barStyle="light-content" />

        <View className="z-10 flex-row items-center justify-between px-5 pb-4 pt-14">
          <View className="mr-4 flex-1">
            <Text
              numberOfLines={1}
              className="text-base font-bold text-white"
            >
              {title}
            </Text>
            <Text className="mt-1 text-xs text-[#C4CEC3]">
              {photos.length > 0
                ? `${activeIndex + 1} dari ${photos.length} foto`
                : "Belum ada foto"}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tutup galeri foto"
            onPress={onClose}
            className="h-11 w-11 items-center justify-center rounded-full bg-white/10"
          >
            <Text className="text-2xl text-white">×</Text>
          </Pressable>
        </View>

        {photos.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
            style={{ flex: 1 }}
          >
            {photos.map((uri, index) => (
              <View
                key={`${uri}-${index}`}
                style={{ width, height: height - 125 }}
                className="items-center justify-center px-3"
              >
                <ClothingPhoto
                  imageUri={uri}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-sm text-white">
              Foto tidak tersedia.
            </Text>
          </View>
        )}

        {photos.length > 1 ? (
          <View className="flex-row items-center justify-center gap-2 pb-10 pt-4">
            {photos.map((uri, index) => (
              <View
                key={`${uri}-dot-${index}`}
                className={`h-2 rounded-full ${
                  index === activeIndex
                    ? "w-6 bg-white"
                    : "w-2 bg-white/40"
                }`}
              />
            ))}
          </View>
        ) : (
          <View className="pb-10 pt-4" />
        )}
      </View>
    </Modal>
  );
}