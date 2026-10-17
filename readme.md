# Otpit — Digital Wardrobe

> Lemari digital untuk mengelola koleksi pakaian, alas kaki, dan aksesori secara praktis, personal, dan offline-first.

## 1. Tentang Otpit

Otpit adalah aplikasi mobile yang membantu pengguna menginventarisasi barang fashion pribadi dalam satu lemari digital.

Pengguna dapat mencatat barang, menambahkan foto, mengelompokkan koleksi berdasarkan kategori, serta mencari barang yang dimiliki tanpa harus membuka lemari fisik.

**Target pasar awal:** pengguna di Indonesia.

**Platform:** Android sebagai prioritas awal, dengan rencana mendukung iOS.

**Pendekatan penyimpanan:** local-first. Data utama disimpan pada perangkat pengguna dan fitur inti tetap dapat digunakan tanpa koneksi internet.

## 2. Tujuan Produk

Otpit dikembangkan untuk membantu pengguna:

- Mengetahui barang fashion yang dimiliki.
- Menemukan pakaian atau aksesori dengan cepat.
- Mengelompokkan koleksi secara terstruktur.
- Mengurangi pembelian barang yang sebenarnya sudah dimiliki.
- Mempersiapkan pengembangan fitur padu padan outfit pada masa mendatang.

## 3. Teknologi

| Bagian | Teknologi |
|---|---|
| Bahasa | TypeScript |
| Mobile UI | React Native |
| Framework | Expo |
| Navigasi | Expo Router, ketika navigasi multi-halaman diperlukan |
| Database lokal | SQLite melalui `expo-sqlite` |
| Pemilihan foto | `expo-image-picker` |
| Kontrol versi | Git dan GitHub |
| Pengujian | TypeScript checks dan pengujian aplikasi secara bertahap |

Versi paket akan mengikuti kompatibilitas dengan versi Expo yang digunakan proyek.

## 4. Sistem Kategori Barang

Otpit menggunakan struktur kategori bertingkat:

**Kategori utama → Subkategori**

Setiap barang mempunyai satu kategori utama dan satu subkategori. Subkategori dapat dikembangkan tanpa harus mengubah seluruh sistem kategori.

### 4.1 Pakaian

#### Atasan
- Kaos
- Kemeja
- Polo shirt
- Jersey
- Blus
- Tunik
- Sweater
- Hoodie
- Jaket
- Cardigan
- Outer lainnya

#### Bawahan
- Celana panjang
- Celana pendek
- Jeans
- Rok
- Legging
- Bawahan lainnya

#### Pakaian terusan
- Dress
- Gamis
- Overall atau jumpsuit
- Pakaian terusan lainnya

#### Pakaian ibadah
- Baju koko
- Mukena
- Sarung
- Pakaian salat lainnya

#### Pakaian dalam dan rumah
- Kaos dalam
- Celana dalam
- Bra
- Piyama
- Baju rumah
- Pakaian dalam atau rumah lainnya

### 4.2 Hijab dan perlengkapan kepala

- Hijab segi empat
- Pashmina
- Bergo
- Ciput atau inner hijab
- Topi
- Kupluk atau beanie
- Perlengkapan kepala lainnya

### 4.3 Alas kaki

- Sepatu sneakers
- Sepatu formal
- Sepatu olahraga
- Sandal
- Selop
- Boots
- Alas kaki lainnya

### 4.4 Kaos kaki

- Kaos kaki pendek
- Kaos kaki panjang
- Kaos kaki olahraga
- Kaos kaki lainnya

### 4.5 Tas

- Ransel
- Tas selempang
- Tote bag
- Handbag
- Dompet
- Tas lainnya

### 4.6 Aksesori

- Ikat pinggang
- Jam tangan
- Gelang
- Kalung
- Cincin
- Kacamata
- Dasi
- Dasi kupu-kupu
- Sarung tangan
- Aksesori lainnya

### Aturan kategori

1. Nama kategori dan subkategori menggunakan bahasa Indonesia.
2. Satu barang hanya memiliki satu subkategori utama pada versi MVP.
3. Kategori harus konsisten agar pencarian dan filter berfungsi dengan baik.
4. Pilihan kategori disimpan sebagai data terstruktur, bukan teks bebas yang diketik pengguna.
5. Daftar kategori dirancang agar mudah ditambah tanpa perlu menulis ulang komponen formulir.
6. Untuk kategori khusus, pengguna dapat memilih subkategori `Lainnya`.

## 5. Ruang Lingkup MVP

MVP adalah versi minimum yang sudah berguna bagi pengguna dan dapat diuji di dunia nyata.

### 5.1 Fitur wajib

#### A. Dashboard lemari
- Menampilkan jumlah barang yang tersimpan.
- Menampilkan daftar koleksi dalam bentuk grid.
- Menampilkan kondisi kosong jika belum ada barang.

#### B. Manajemen barang
- Menambahkan barang.
- Melihat detail barang.
- Mengedit informasi barang.
- Menghapus barang dengan konfirmasi.

#### C. Informasi barang

Setiap barang memiliki:

- ID unik.
- Nama barang.
- Kategori utama.
- Subkategori.
- Warna.
- Foto opsional.
- Catatan opsional.
- Waktu pembuatan dan pembaruan.

Merek, ukuran, harga pembelian, dan tanggal pembelian dapat ditambahkan setelah kebutuhan pengguna tervalidasi.

#### D. Pencarian dan filter
- Pencarian berdasarkan nama barang.
- Filter kategori utama.
- Filter subkategori.
- Filter warna jika diperlukan.

#### E. Penyimpanan lokal
- Data tersimpan di SQLite.
- Data tetap tersedia setelah aplikasi ditutup.
- Foto disimpan sebagai file lokal, sedangkan database menyimpan referensi atau path foto.
- Fitur inti dapat digunakan tanpa internet.

### 5.2 Di luar MVP

Fitur berikut tidak menjadi prioritas versi pertama:

- Login dan registrasi.
- Sinkronisasi cloud.
- Berbagi lemari dengan pengguna lain.
- Rekomendasi outfit otomatis.
- AI untuk mengenali jenis pakaian dari foto.
- Kalender outfit.
- Statistik pemakaian pakaian.
- Marketplace dan integrasi belanja.

Fitur tersebut baru dipertimbangkan setelah MVP stabil dan kebutuhan pengguna lebih jelas.

## 6. Prinsip Clean Code dan Arsitektur

Otpit menggunakan pendekatan modular yang mudah dipahami oleh developer pemula dan tetap dapat dikembangkan seiring pertumbuhan proyek.

Prinsip utama:

- **Separation of concerns:** UI, logika bisnis, dan akses database dipisahkan.
- **Single responsibility:** setiap komponen atau modul memiliki tanggung jawab yang jelas.
- **Type safety:** gunakan tipe TypeScript untuk data dan parameter fungsi.
- **Reusable components:** komponen UI yang berulang dibuat agar bisa digunakan kembali.
- **Satu sumber data:** SQLite menjadi sumber data utama setelah implementasi persistensi selesai.
- **Minim duplikasi:** kategori dan aturan data didefinisikan di satu tempat.
- **Sederhana dahulu:** hindari abstraksi atau pola arsitektur kompleks sebelum benar-benar diperlukan.

### Struktur folder yang direncanakan

```text
otpit/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── items/
│       ├── new.tsx
│       └── [id].tsx
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── wardrobe/
│   │   └── forms/
│   │
│   ├── features/
│   │   └── wardrobe/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── screens/
│   │       └── utils/
│   │
│   ├── database/
│   │   ├── migrations/
│   │   ├── client.ts
│   │   └── repositories/
│   │
│   ├── services/
│   │   └── image-storage.ts
│   │
│   ├── constants/
│   │   └── categories.ts
│   │
│   └── types/
│       └── clothing.ts
│
├── assets/
├── docs/
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

Struktur ini adalah target arsitektur, bukan berarti semua folder harus dibuat sekaligus. Proyek akan dipindahkan dari `App.tsx` secara bertahap ketika fitur mulai bertambah.

Expo Router menggunakan folder `app/` untuk rute. Folder `src/` menampung logika dan komponen yang dapat digunakan kembali. Konfigurasi proyek yang sudah ada harus dipertahankan ketika migrasi dilakukan.

## 7. Model Data

### ClothingItem

```typescript
export type ClothingItem = {
  id: string;
  name: string;
  categoryId: string;
  subcategoryId: string;
  color: string;
  imageUri: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
};
```

### ClothingCategory

```typescript
export type ClothingCategory = {
  id: string;
  name: string;
  parentId: string | null;
};
```

`parentId` bernilai `null` untuk kategori utama. Subkategori merujuk pada ID kategori induknya.

Pendekatan ID kategori membuat data barang tidak bergantung pada nama kategori yang bisa berubah. Daftar kategori nantinya dapat dikelola melalui satu sumber konfigurasi.

Untuk SQLite, kategori utama dan subkategori dapat disimpan dalam tabel kategori yang sama menggunakan relasi induk-anak. Tabel barang menyimpan ID subkategori yang dipilih.

## 8. Gambaran Database Lokal

### Tabel `categories`

| Kolom | Keterangan |
|---|---|
| `id` | Primary key kategori |
| `name` | Nama kategori |
| `parent_id` | ID kategori induk, boleh kosong |

### Tabel `clothing_items`

| Kolom | Keterangan |
|---|---|
| `id` | Primary key barang |
| `name` | Nama barang |
| `category_id` | Foreign key subkategori |
| `color` | Warna barang |
| `image_uri` | Referensi file foto, boleh kosong |
| `notes` | Catatan opsional |
| `created_at` | Waktu pembuatan |
| `updated_at` | Waktu pembaruan |

Database juga harus memiliki indeks yang sesuai untuk pencarian atau filter ketika jumlah barang bertambah.

Perubahan skema database dikelola menggunakan migrasi agar pembaruan aplikasi tidak merusak data pengguna.

## 9. Strategi Penyimpanan Offline-First

1. Pengguna menambahkan atau mengedit barang.
2. Aplikasi memvalidasi input.
3. Perubahan disimpan ke database SQLite.
4. UI memperbarui daftar berdasarkan data terbaru.
5. Foto disalin ke lokasi penyimpanan aplikasi yang sesuai dan referensinya dicatat di database.
6. Aplikasi dapat membaca koleksi tanpa koneksi internet.

Penyimpanan foto dan database perlu ditangani dengan hati-hati. Jika penyimpanan foto gagal, aplikasi tidak boleh menghasilkan barang dengan referensi foto yang rusak tanpa penanganan yang jelas.

Data lokal tidak otomatis tersedia di perangkat lain. Fitur pencadangan dan pemulihan akan dievaluasi sebelum Otpit digunakan untuk koleksi penting dalam jangka panjang.

## 10. Roadmap Pengembangan

### Fase 1 — Fondasi aplikasi
- [ ] Menyiapkan React Native, Expo, dan TypeScript.
- [ ] Menyusun kategori dan subkategori.
- [ ] Membuat dashboard lemari.
- [ ] Membuat formulir barang.
- [ ] Mengimplementasikan tambah, edit, dan hapus menggunakan state.

### Fase 2 — Persistensi lokal
- [ ] Menambahkan SQLite.
- [ ] Membuat tabel dan migrasi database.
- [ ] Memisahkan akses database dari komponen UI.
- [ ] Memastikan data bertahan setelah aplikasi ditutup.

### Fase 3 — Foto dan pencarian
- [ ] Memilih foto dari galeri.
- [ ] Menyimpan foto di perangkat.
- [ ] Mengimplementasikan pencarian dan filter.
- [ ] Menangani foto yang hilang dan error penyimpanan.

### Fase 4 — Kualitas produk
- [ ] Memvalidasi seluruh formulir.
- [ ] Menguji kondisi kosong dan error.
- [ ] Menguji penggunaan tanpa internet.
- [ ] Menguji perubahan dan penghapusan data.
- [ ] Menguji pada beberapa perangkat Android.

### Fase 5 — Validasi dan rilis
- [ ] Menguji MVP bersama pengguna awal.
- [ ] Mengumpulkan masukan.
- [ ] Menyiapkan ikon, screenshot, dan deskripsi aplikasi.
- [ ] Menyiapkan pengujian dan publikasi Google Play.
- [ ] Mengevaluasi kesiapan versi iOS.

## 11. Kriteria MVP Siap Diuji

MVP dianggap siap diuji ketika:

- Pengguna dapat menambah barang dengan kategori yang benar.
- Pengguna dapat melihat, mengedit, dan menghapus barang.
- Pencarian dan filter menampilkan hasil yang sesuai.
- Foto tersimpan dan ditampilkan dengan benar.
- Data tetap tersedia setelah aplikasi ditutup dan dibuka kembali.
- Fitur inti bekerja tanpa internet.
- Kesalahan input ditangani dengan jelas.
- Penghapusan barang dan penanganan file tidak menyebabkan data yang tidak konsisten.

## 12. Arah Pengembangan Jangka Panjang

Setelah MVP tervalidasi, Otpit dapat dikembangkan dengan:

- Kombinasi outfit dari barang yang sudah dimiliki.
- Perencana outfit harian.
- Statistik penggunaan pakaian.
- Pengelolaan barang yang jarang dipakai.
- Pencadangan dan sinkronisasi cloud.
- Rekomendasi outfit berbantuan AI.

Semua fitur lanjutan harus tetap mendukung tujuan utama: membantu pengguna mengelola dan memanfaatkan koleksi fashion miliknya.

---

**Prinsip pengembangan Otpit:** bangun fitur yang benar-benar dibutuhkan, jaga data pengguna tetap aman, dan tambah kompleksitas hanya ketika produk membutuhkannya.