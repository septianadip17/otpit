import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  View,
  type ImageResizeMode,
} from "react-native";

import { getDisplayImageUri } from "../services/clothingImageStorage";

type Props = {
  imageUri: string | null;
  fallbackEmoji?: string;
  resizeMode?: ImageResizeMode;
};

export default function ClothingPhoto({
  imageUri,
  fallbackEmoji = "👕",
  resizeMode = "contain",
}: Props) {
  const [displayUri, setDisplayUri] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    setDisplayUri(null);
    setFailed(false);

    if (!imageUri) {
      setLoading(false);
      return;
    }

    setLoading(true);

    getDisplayImageUri(imageUri)
      .then((uri) => {
        if (active) {
          setDisplayUri(uri);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setFailed(true);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [imageUri]);

  if (!imageUri || failed) {
    return (
      <View className="h-full w-full items-center justify-center">
        <Text className="text-6xl">{fallbackEmoji}</Text>
      </View>
    );
  }

  if (loading || !displayUri) {
    return (
      <View className="h-full w-full items-center justify-center">
        <ActivityIndicator color="#344C3D" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: displayUri }}
      resizeMode={resizeMode}
      style={{ width: "100%", height: "100%" }}
      onError={() => setFailed(true)}
      accessibilityLabel="Foto pakaian"
    />
  );
}