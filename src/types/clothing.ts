
export type ClothingCategoryId =
  | "tops"
  | "bottoms"
  | "one-piece"
  | "religious-wear"
  | "underwear-homewear"
  | "headwear"
  | "footwear"
  | "socks"
  | "bags"
  | "accessories"
  | "other";

export type ClothingSubcategory = {
  id: string;
  name: string;
};

export type ClothingCategory = {
  id: ClothingCategoryId;
  name: string;
  subcategories: ClothingSubcategory[];
};

export type ClothingItem = {
  id: string;
  name: string;
  categoryId: ClothingCategoryId;
  subcategoryId: string;
  color: string;
  imageUri: string | null;
  imageUris?: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
};
