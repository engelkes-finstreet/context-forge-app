"use client";

import { useRouter } from "next/navigation";
import { SubtaskType } from "@prisma/client";
import {
  FileText,
  Globe,
  LayoutList,
  GitBranch,
  ClipboardList,
  PanelTop,
  ListFilter,
  FileInput,
  PanelLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelectedTypeStore } from "@/features/subtasks/stores/selected-type-store";
import {
  getTypesByCategory,
  type SubtaskTypeConfig,
  type SubtaskCategory,
} from "@/features/subtasks/config/type-config";
import { cn } from "@/lib/utils";
import {
  StaggeredContainer,
  StaggeredItem,
} from "@/components/ui/staggered-container";

/**
 * Map icon names from config to Lucide components
 */
const ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  Globe,
  LayoutList,
  GitBranch,
  ClipboardList,
  PanelTop,
  ListFilter,
  FileInput,
  PanelLeft,
};

/**
 * Category color accents for icon backgrounds
 */
const CATEGORY_ICON_COLORS: Record<SubtaskCategory, string> = {
  forms: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  api: "bg-green-500/15 text-green-600 dark:text-green-400",
  lists: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  navigation: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  other: "bg-gray-500/15 text-gray-600 dark:text-gray-400",
};

/**
 * TypeSelector Component
 *
 * Displays a categorized list of subtask types for selection.
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

  const categorizedTypes = getTypesByCategory();

  return (
    <div className="space-y-8">
      {categorizedTypes.map(({ category, config, types }) => (
        <div key={category}>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
            {config.label}
          </h3>
          <StaggeredContainer className="space-y-2">
            {types.map((typeConfig) => (
              <StaggeredItem key={typeConfig.type}>
                <TypeItem
                  config={typeConfig}
                  category={category}
                  onSelect={() => handleTypeSelect(typeConfig.type)}
                />
              </StaggeredItem>
            ))}
          </StaggeredContainer>
        </div>
      ))}

      <div className="flex justify-start pt-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

interface TypeItemProps {
  config: SubtaskTypeConfig;
  category: SubtaskCategory;
  onSelect: () => void;
}

function TypeItem({ config, category, onSelect }: TypeItemProps) {
  const Icon = ICON_MAP[config.icon] || FileText;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-lg border transition-all",
        "hover:shadow-md hover:scale-[1.01] active:scale-[0.99]",
        "bg-card hover:bg-accent/50",
        "group cursor-pointer text-left"
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
          CATEGORY_ICON_COLORS[category]
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-base">{config.label}</div>
        <div className="text-sm text-muted-foreground">
          {config.description}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
