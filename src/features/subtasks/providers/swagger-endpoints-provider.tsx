"use client";

import { useEffect, useRef } from "react";
import type { SwaggerEndpoint } from "@/lib/services/swagger-service";
import { useSwaggerEndpointsStore } from "@/features/subtasks/stores/swagger-endpoints-store";

interface SwaggerEndpointsProviderProps {
  endpoints: SwaggerEndpoint[];
  children: React.ReactNode;
}

export function SwaggerEndpointsProvider({
  endpoints,
  children,
}: SwaggerEndpointsProviderProps) {
  const setEndpoints = useSwaggerEndpointsStore((state) => state.setEndpoints);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (!hasHydrated.current) {
      setEndpoints(endpoints);
      hasHydrated.current = true;
    }
  }, [endpoints, setEndpoints]);

  return <>{children}</>;
}
