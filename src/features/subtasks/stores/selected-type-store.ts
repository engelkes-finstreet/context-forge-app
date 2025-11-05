import { create } from "zustand";
import { SubtaskType } from "@prisma/client";

interface SelectedTypeStore {
  selectedType: SubtaskType | null;
  setSelectedType: (type: SubtaskType | null) => void;
  clearSelectedType: () => void;
}

export const useSelectedTypeStore = create<SelectedTypeStore>((set) => ({
  selectedType: null,
  setSelectedType: (type) => set({ selectedType: type }),
  clearSelectedType: () => set({ selectedType: null }),
}));
