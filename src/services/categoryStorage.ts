import AsyncStorage from "@react-native-async-storage/async-storage";
import { CLOTHING_CATEGORIES } from "../constants/categories";
import type { ClothingCategory } from "../types/clothing";

const CATEGORY_STORAGE_KEY = "@otpit/clothing-categories";

export async function loadCategories(): Promise<ClothingCategory[]> {
  const stored = await AsyncStorage.getItem(CATEGORY_STORAGE_KEY);

  if (stored === null) {
    const defaultCategories = CLOTHING_CATEGORIES.map((category) => ({
      ...category,
      isDefault: true,
    }));

    await saveCategories(defaultCategories);

    return defaultCategories;
  }

  const parsed: unknown = JSON.parse(stored);

  if (!Array.isArray(parsed)) {
    throw new Error("Format data kategori tidak valid.");
  }

  return parsed as ClothingCategory[];
}

export async function saveCategories(
  categories: ClothingCategory[],
): Promise<void> {
  await AsyncStorage.setItem(
    CATEGORY_STORAGE_KEY,
    JSON.stringify(categories),
  );
}