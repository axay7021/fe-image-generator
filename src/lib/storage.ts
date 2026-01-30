import {
  TransformationType,
  PassportMode,
} from "@/components/home/TransformationSelector";

const DB_NAME = "AIPhotoGeneratorDB";
const STORE_NAME = "images";
const DB_VERSION = 1;

// Define the shape of our saved state
export interface GenerationState {
  selectedType: TransformationType | null;
  prompts: Record<string, string>;
  step: number;
  selectedStyle?: string;
  passportMode?: PassportMode;
  suitColor?: string;
  tieColor?: string;
  bgCategory?: string;
  image?: File | null;
  timestamp: number;
}

// IndexedDB Helper for Image File
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

export const saveImageToDB = async (file: File): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(file, "currentImage");

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getImageFromDB = async (): Promise<File | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get("currentImage");

    request.onsuccess = () => resolve((request.result as File) || null);
    request.onerror = () => reject(request.error);
  });
};

export const clearImageFromDB = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete("currentImage");

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// LocalStorage Helper for Settings
const STORAGE_KEY = "generation_settings";

export const saveSettingsToLocal = (state: Omit<GenerationState, "image">) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save settings to localStorage:", error);
  }
};

export const getSettingsFromLocal = (): Omit<
  GenerationState,
  "image"
> | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Failed to load settings from localStorage:", error);
    return null;
  }
};

export const clearSettingsFromLocal = () => {
  localStorage.removeItem(STORAGE_KEY);
};
