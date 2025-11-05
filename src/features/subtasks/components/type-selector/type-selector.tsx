"use client";

import { useRouter } from "next/navigation";
import { TypeCard } from "./type-card";
import { SUBTASK_TYPE_CONFIG } from "@/features/subtasks/config/type-config";
import { Button } from "@/components/ui/button";
import {
  StaggeredContainer,
  StaggeredItem,
} from "@/components/ui/staggered-container";
import { useSelectedTypeStore } from "@/features/subtasks/stores/selected-type-store";
import { SubtaskType } from "@prisma/client";

/**
 * TypeSelector Component
 *
 * Displays a grid of type cards for selecting the subtask type to create.
 * This is Step 1 of the two-step subtask creation wizard.
 */
export function TypeSelector() {
  const router = useRouter();
  const setSelectedType = useSelectedTypeStore(
    (state) => state.setSelectedType,
  );

  const handleTypeSelect = (type: SubtaskType) => {
    setSelectedType(type);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(SUBTASK_TYPE_CONFIG).map((config) => (
          <StaggeredItem key={config.type}>
            <TypeCard
              config={config}
              onClick={() => handleTypeSelect(config.type)}
            />
          </StaggeredItem>
        ))}
      </StaggeredContainer>

      <div className="flex justify-start">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
