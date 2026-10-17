import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";

const IMAGE_DIRECTORY = "otpit-images/";
const WEB_IMAGE_PREFIX = "otpit-image://";

const DATABASE_NAME = "otpit-image-storage";
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "images";

type StoredWebImage = {
  id: string;
  blob: Blob;
};

const objectUrlCache = new Map<string, string>();

function openImageDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Penyimpanan gambar browser tidak tersedia."));
      return;
    }

    const request = indexedDB.open(
      DATABASE_NAME,
      DATABASE_VERSION,
    );

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        database.createObjectStore(OBJECT_STORE_NAME, {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Gagal membuka database gambar."));
  });
}

async function putWebImage(
  id: string,
  blob: Blob,
): Promise<void> {
  const database = await openImageDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        OBJECT_STORE_NAME,
        "readwrite",
      );

      transaction.objectStore(OBJECT_STORE_NAME).put({
        id,
        blob,
      } satisfies StoredWebImage);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(transaction.error ?? new Error("Gagal menyimpan gambar."));
      transaction.onabort = () =>
        reject(transaction.error ?? new Error("Penyimpanan gambar dibatalkan."));
    });
  } finally {
    database.close();
  }
}

async function getWebImage(id: string): Promise<Blob | null> {
  const database = await openImageDatabase();

  try {
    return await new Promise<Blob | null>((resolve, reject) => {
      const transaction = database.transaction(
        OBJECT_STORE_NAME,
        "readonly",
      );

      const request = transaction.objectStore(OBJECT_STORE_NAME).get(id);

      request.onsuccess = () => {
        const result = request.result as StoredWebImage | undefined;
        resolve(result?.blob ?? null);
      };

      request.onerror = () =>
        reject(request.error ?? new Error("Gagal membaca gambar."));
    });
  } finally {
    database.close();
  }
}

async function removeWebImage(id: string): Promise<void> {
  const database = await openImageDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        OBJECT_STORE_NAME,
        "readwrite",
      );

      transaction.objectStore(OBJECT_STORE_NAME).delete(id);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(transaction.error ?? new Error("Gagal menghapus gambar."));
    });
  } finally {
    database.close();
  }
}

function getWebImageId(uri: string): string | null {
  if (!uri.startsWith(WEB_IMAGE_PREFIX)) {
    return null;
  }

  return uri.slice(WEB_IMAGE_PREFIX.length);
}

/**
 * Menyimpan gambar yang sudah dikompres.
 * Mengembalikan URI permanen yang dapat disimpan di ClothingItem.imageUri.
 */
export async function saveClothingImage(
  sourceUri: string,
  imageId: string,
): Promise<string> {
  if (Platform.OS === "web") {
    const response = await fetch(sourceUri);

    if (!response.ok) {
      throw new Error("Foto tidak bisa dibaca oleh browser.");
    }

    const blob = await response.blob();

    await putWebImage(imageId, blob);

    return `${WEB_IMAGE_PREFIX}${imageId}`;
  }

  const documentDirectory = FileSystem.documentDirectory;

  if (!documentDirectory) {
    throw new Error("Direktori penyimpanan foto tidak tersedia.");
  }

  const directoryUri = `${documentDirectory}${IMAGE_DIRECTORY}`;
  const directoryInfo = await FileSystem.getInfoAsync(directoryUri);

  if (!directoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(directoryUri, {
      intermediates: true,
    });
  }

  const destinationUri = `${directoryUri}${imageId}.jpg`;

  await FileSystem.copyAsync({
    from: sourceUri,
    to: destinationUri,
  });

  return destinationUri;
}

/**
 * Mengubah referensi gambar tersimpan menjadi URI yang dapat ditampilkan.
 */
export async function getDisplayImageUri(
  storedUri: string,
): Promise<string> {
  if (Platform.OS !== "web") {
    return storedUri;
  }

  const imageId = getWebImageId(storedUri);

  if (!imageId) {
    return storedUri;
  }

  const cachedUrl = objectUrlCache.get(imageId);

  if (cachedUrl) {
    return cachedUrl;
  }

  const blob = await getWebImage(imageId);

  if (!blob) {
    throw new Error("Foto tidak ditemukan di penyimpanan browser.");
  }

  const objectUrl = URL.createObjectURL(blob);
  objectUrlCache.set(imageId, objectUrl);

  return objectUrl;
}

/**
 * Menghapus file foto milik Otpit, bukan foto asli di galeri pengguna.
 */
export async function deleteClothingImage(
  storedUri: string | null,
): Promise<void> {
  if (!storedUri) return;

  if (Platform.OS === "web") {
    const imageId = getWebImageId(storedUri);

    if (!imageId) return;

    const cachedUrl = objectUrlCache.get(imageId);

    if (cachedUrl) {
      URL.revokeObjectURL(cachedUrl);
      objectUrlCache.delete(imageId);
    }

    await removeWebImage(imageId);
    return;
  }

  const documentDirectory = FileSystem.documentDirectory;

  if (!documentDirectory) return;

  const ownedDirectory = `${documentDirectory}${IMAGE_DIRECTORY}`;

  // Jangan menghapus URI foto yang bukan milik penyimpanan Otpit.
  if (!storedUri.startsWith(ownedDirectory)) return;

  const info = await FileSystem.getInfoAsync(storedUri);

  if (info.exists) {
    await FileSystem.deleteAsync(storedUri, {
      idempotent: true,
    });
  }
}