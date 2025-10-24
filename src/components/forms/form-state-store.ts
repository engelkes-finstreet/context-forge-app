import { create } from "zustand";

type FormIsPendingData = {
  isPending: boolean;
};

interface FormIsPendingStore {
  data: FormIsPendingData;
  setData: (data: FormIsPendingData) => void;
}

export const useFormIsPending = create<FormIsPendingStore>((set) => ({
  data: {
    isPending: false,
  },
  setData: (data) => set({ data }),
}));
