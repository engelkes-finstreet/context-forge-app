import { create } from "zustand";
import type { SwaggerEndpoint } from "@/lib/services/swagger-service";

interface SwaggerEndpointsStore {
  endpoints: SwaggerEndpoint[];
  setEndpoints: (endpoints: SwaggerEndpoint[]) => void;
}

export const useSwaggerEndpointsStore = create<SwaggerEndpointsStore>(
  (set) => ({
    endpoints: [],
    setEndpoints: (endpoints) => set({ endpoints }),
  }),
);
