
import type { ClothingCategory } from "../types/clothing";

export const CLOTHING_CATEGORIES: ClothingCategory[] = [
  {
    id: "tops",
    name: "Atasan",
    subcategories: [
      { id: "t-shirt", name: "Kaos" },
      { id: "shirt", name: "Kemeja" },
      { id: "polo", name: "Polo shirt" },
      { id: "jersey", name: "Jersey" },
      { id: "blouse", name: "Blus" },
      { id: "tunic", name: "Tunik" },
      { id: "sweater", name: "Sweater" },
      { id: "hoodie", name: "Hoodie" },
      { id: "jacket", name: "Jaket" },
      { id: "cardigan", name: "Cardigan" },
      { id: "other-tops", name: "Atasan lainnya" },
    ],
  },
  {
    id: "bottoms",
    name: "Bawahan",
    subcategories: [
      { id: "long-pants", name: "Celana panjang" },
      { id: "shorts", name: "Celana pendek" },
      { id: "jeans", name: "Jeans" },
      { id: "skirt", name: "Rok" },
      { id: "leggings", name: "Legging" },
      { id: "other-bottoms", name: "Bawahan lainnya" },
    ],
  },
  {
    id: "one-piece",
    name: "Pakaian terusan",
    subcategories: [
      { id: "dress", name: "Dress" },
      { id: "gamis", name: "Gamis" },
      { id: "jumpsuit", name: "Overall / jumpsuit" },
      { id: "other-one-piece", name: "Terusan lainnya" },
    ],
  },
  {
    id: "religious-wear",
    name: "Pakaian ibadah",
    subcategories: [
      { id: "baju-koko", name: "Baju koko" },
      { id: "mukena", name: "Mukena" },
      { id: "sarung", name: "Sarung" },
      { id: "prayer-outfit", name: "Pakaian salat lainnya" },
    ],
  },
  {
    id: "underwear-homewear",
    name: "Pakaian dalam & rumah",
    subcategories: [
      { id: "undershirt", name: "Kaos dalam" },
      { id: "underwear", name: "Celana dalam" },
      { id: "bra", name: "Bra" },
      { id: "pajamas", name: "Piyama" },
      { id: "homewear", name: "Baju rumah" },
      { id: "other-homewear", name: "Lainnya" },
    ],
  },
  {
    id: "headwear",
    name: "Hijab & penutup kepala",
    subcategories: [
      { id: "hijab-square", name: "Hijab segi empat" },
      { id: "pashmina", name: "Pashmina" },
      { id: "bergo", name: "Bergo" },
      { id: "inner-hijab", name: "Ciput / inner hijab" },
      { id: "cap", name: "Topi" },
      { id: "beanie", name: "Kupluk / beanie" },
      { id: "other-headwear", name: "Lainnya" },
    ],
  },
  {
    id: "footwear",
    name: "Alas kaki",
    subcategories: [
      { id: "sneakers", name: "Sneakers" },
      { id: "formal-shoes", name: "Sepatu formal" },
      { id: "sports-shoes", name: "Sepatu olahraga" },
      { id: "sandals", name: "Sandal" },
      { id: "slippers", name: "Selop" },
      { id: "boots", name: "Boots" },
      { id: "other-footwear", name: "Alas kaki lainnya" },
    ],
  },
  {
    id: "socks",
    name: "Kaos kaki",
    subcategories: [
      { id: "short-socks", name: "Kaos kaki pendek" },
      { id: "long-socks", name: "Kaos kaki panjang" },
      { id: "sports-socks", name: "Kaos kaki olahraga" },
      { id: "other-socks", name: "Lainnya" },
    ],
  },
  {
    id: "bags",
    name: "Tas & dompet",
    subcategories: [
      { id: "backpack", name: "Ransel" },
      { id: "sling-bag", name: "Tas selempang" },
      { id: "tote-bag", name: "Tote bag" },
      { id: "handbag", name: "Handbag" },
      { id: "wallet", name: "Dompet" },
      { id: "other-bags", name: "Lainnya" },
    ],
  },
  {
    id: "accessories",
    name: "Aksesori",
    subcategories: [
      { id: "belt", name: "Ikat pinggang" },
      { id: "watch", name: "Jam tangan" },
      { id: "bracelet", name: "Gelang" },
      { id: "necklace", name: "Kalung" },
      { id: "ring", name: "Cincin" },
      { id: "glasses", name: "Kacamata" },
      { id: "tie", name: "Dasi" },
      { id: "bow-tie", name: "Dasi kupu-kupu" },
      { id: "gloves", name: "Sarung tangan" },
      { id: "other-accessories", name: "Lainnya" },
    ],
  },
  {
    id: "other",
    name: "Lainnya",
    subcategories: [
      { id: "miscellaneous", name: "Barang lainnya" },
    ],
  },
];
