
export type ClothingCategoryId = string;

export type ClothingSubcategory = {
  id: string;
  name: string;
};

export type ClothingCategory = {
  id: ClothingCategoryId;
  name: string;
  isDefault: boolean;
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
