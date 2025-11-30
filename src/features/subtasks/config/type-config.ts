/**
 * Subtask Type Configuration
 *
 * This file defines the UI configuration for each subtask type:
 * - Display labels and descriptions
 * - Icons (Lucide icon names)
 * - Categories for grouping
 * - Routes for type-specific forms
 * - Visibility (which types are enabled)
 */

import { SubtaskType } from "@prisma/client";

/**
 * Categories for grouping subtask types in the selector
 */
export type SubtaskCategory =
  | "forms"
  | "api"
  | "lists"
  | "navigation"
  | "other";

export interface CategoryConfig {
  label: string;
  order: number;
}

export const CATEGORY_CONFIG: Record<SubtaskCategory, CategoryConfig> = {
  forms: { label: "Forms", order: 1 },
  api: { label: "Data & API", order: 2 },
  lists: { label: "Lists", order: 3 },
  navigation: { label: "Navigation & UI", order: 4 },
  other: { label: "Other", order: 5 },
};

export interface SubtaskTypeConfig {
  type: SubtaskType;
  label: string;
  description: string;
  icon: string; // Lucide icon name
  route: string; // Route suffix for type-specific form (e.g., "generic", "form")
  enabled: boolean; // Whether this type is available for selection
  category: SubtaskCategory;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

/**
 * Configuration for all subtask types
 * To enable/disable a type, change the `enabled` flag
 */
export const SUBTASK_TYPE_CONFIG: Record<SubtaskType, SubtaskTypeConfig> = {
  [SubtaskType.GENERIC]: {
    type: SubtaskType.GENERIC,
    label: "Generic",
    description: "Standard subtask with name and content",
    icon: "FileText",
    route: "generic",
    enabled: true,
    category: "other",
    badgeVariant: "default",
  },

  [SubtaskType.REQUEST]: {
    type: SubtaskType.REQUEST,
    label: "Request",
    description: "API request to external service",
    icon: "Globe",
    route: "request",
    enabled: true,
    category: "api",
    badgeVariant: "default",
  },

  [SubtaskType.INTERACTIVE_LIST]: {
    type: SubtaskType.INTERACTIVE_LIST,
    label: "Interactive List",
    description: "List with presentations and interactions",
    icon: "LayoutList",
    route: "presentation-list",
    enabled: true,
    category: "lists",
    badgeVariant: "default",
  },

  [SubtaskType.INQUIRY_PROCESS]: {
    type: SubtaskType.INQUIRY_PROCESS,
    label: "Inquiry Process",
    description: "Multi-step wizard with progress tracking",
    icon: "GitBranch",
    route: "inquiry-process",
    enabled: true,
    category: "navigation",
    badgeVariant: "secondary",
  },

  [SubtaskType.FORM]: {
    type: SubtaskType.FORM,
    label: "Form",
    description: "Single form with fields and validation",
    icon: "ClipboardList",
    route: "form",
    enabled: true,
    category: "forms",
    badgeVariant: "outline",
  },

  [SubtaskType.MODAL]: {
    type: SubtaskType.MODAL,
    label: "Modal",
    description: "Dialog or popup component",
    icon: "PanelTop",
    route: "modal",
    enabled: true,
    category: "navigation",
    badgeVariant: "secondary",
  },

  [SubtaskType.LIST_ACTIONS_AND_PAGINATION]: {
    type: SubtaskType.LIST_ACTIONS_AND_PAGINATION,
    label: "List Actions & Pagination",
    description: "List with actions and pagination controls",
    icon: "ListFilter",
    route: "list-actions-and-pagination",
    enabled: true,
    category: "lists",
    badgeVariant: "default",
  },

  [SubtaskType.SIMPLE_FORM]: {
    type: SubtaskType.SIMPLE_FORM,
    label: "Simple Form",
    description: "Basic form with swagger path",
    icon: "FileInput",
    route: "simple-form",
    enabled: true,
    category: "forms",
    badgeVariant: "outline",
  },

  [SubtaskType.PAGE]: {
    type: SubtaskType.PAGE,
    label: "Page",
    description: "Inquiry or portal page with translations",
    icon: "PanelLeft",
    route: "page",
    enabled: true,
    category: "navigation",
    badgeVariant: "secondary",
  },
};

/**
 * Get configuration for a specific subtask type
 */
export function getTypeConfig(type: SubtaskType): SubtaskTypeConfig {
  return SUBTASK_TYPE_CONFIG[type ?? SubtaskType.GENERIC];
}

/**
 * Get all enabled subtask types grouped by category
 * Returns categories sorted by their configured order
 */
export function getTypesByCategory(): Array<{
  category: SubtaskCategory;
  config: CategoryConfig;
  types: SubtaskTypeConfig[];
}> {
  const enabledTypes = Object.values(SUBTASK_TYPE_CONFIG).filter(
    (config) => config.enabled,
  );

  const grouped = enabledTypes.reduce(
    (acc, typeConfig) => {
      const category = typeConfig.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(typeConfig);
      return acc;
    },
    {} as Record<SubtaskCategory, SubtaskTypeConfig[]>,
  );

  return Object.entries(grouped)
    .map(([category, types]) => ({
      category: category as SubtaskCategory,
      config: CATEGORY_CONFIG[category as SubtaskCategory],
      types,
    }))
    .sort((a, b) => a.config.order - b.config.order);
}
