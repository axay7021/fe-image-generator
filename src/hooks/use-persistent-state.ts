import { useState, useCallback } from "react";
import {
  saveImageToDB,
  getImageFromDB,
  clearImageFromDB,
  saveSettingsToLocal,
  getSettingsFromLocal,
  clearSettingsFromLocal,
  GenerationState,
} from "@/lib/storage";

export function usePersistentGenerationState() {
  const [isRestoring, setIsRestoring] = useState(false);

  const saveState = useCallback(async (state: GenerationState) => {
    try {
      // 1. Save File to IndexedDB if exists
      if (state.image) {
        await saveImageToDB(state.image);
      }

      // 2. Save Metadata to LocalStorage (exclude image)
      const { image, ...settings } = state;
      saveSettingsToLocal(settings);
    } catch (error) {
      console.error("Failed to save persistent state:", error);
    }
  }, []);

  const loadState = useCallback(async (): Promise<GenerationState | null> => {
    setIsRestoring(true);
    try {
      const settings = getSettingsFromLocal();
      if (!settings) return null;

      // Check if stale (e.g., > 1 hour old) - optional cleanup
      const ONE_HOUR = 60 * 60 * 1000;
      if (Date.now() - settings.timestamp > ONE_HOUR) {
        await clearState();
        return null;
      }

      const image = await getImageFromDB();
      return { ...settings, image };
    } catch (error) {
      console.error("Failed to load persistent state:", error);
      return null;
    } finally {
      setIsRestoring(false);
    }
  }, []);

  const clearState = useCallback(async () => {
    try {
      await clearImageFromDB();
      clearSettingsFromLocal();
    } catch (error) {
      console.error("Failed to clear persistent state:", error);
    }
  }, []);

  return {
    saveState,
    loadState,
    clearState,
    isRestoring,
  };
}
