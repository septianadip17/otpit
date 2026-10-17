
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ClothingItem } from "../types/clothing";
import { STORAGE_KEY } from "../constants/wardrobe";

export async function loadClothingItems(): Promise<ClothingItem[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  const parsed: unknown = JSON.parse(stored);

  if (!Array.isArray(parsed)) {
    throw new Error("Format data koleksi tidak valid.");
  }

  return parsed as ClothingItem[];
}

export async function saveClothingItems(
  items: ClothingItem[],
): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
