/**
 * Subtask Type Configuration
 *
 * This file defines the UI configuration for each subtask type:
 * - Display labels and descriptions
 * - Icons
 * - Routes for type-specific forms
 * - Visibility (which types are enabled)
 */

import { SubtaskType } from "@prisma/client";

export interface SubtaskTypeConfig {
  type: SubtaskType;
  label: string;
  description: string;
  icon: string;
  route: string; // Route suffix for type-specific form (e.g., "generic", "form")
  enabled: boolean; // Whether this type is available for selection
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
    icon: "📝",
    route: "generic",
    enabled: true,
    badgeVariant: "default",
  },

  [SubtaskType.REQUEST]: {
    type: SubtaskType.REQUEST,
    label: "Request",
    description: "Request to an external API",
    icon: "🌐",
    route: "request",
    enabled: true,
    badgeVariant: "default",
  },

  [SubtaskType.INTERACTIVE_LIST]: {
    type: SubtaskType.INTERACTIVE_LIST,
    label: "Interactive List",
    description: "List of presentations",
    icon: "📊",
    route: "presentation-list",
    enabled: true,
    badgeVariant: "default",
  },

  [SubtaskType.INQUIRY_PROCESS]: {
    type: SubtaskType.INQUIRY_PROCESS,
    label: "Inquiry Process",
    description: "Multi-step form wizard with progress tracking",
    icon: "🔄",
    route: "inquiry-process",
    enabled: true,
    badgeVariant: "secondary",
  },

  [SubtaskType.FORM]: {
    type: SubtaskType.FORM,
    label: "Form",
    description: "Single form with field definitions and validation",
    icon: "📋",
    route: "form",
    enabled: true,
    badgeVariant: "outline",
  },

  [SubtaskType.MODAL]: {
    type: SubtaskType.MODAL,
    label: "Modal",
    description: "Dialog or popup component",
    icon: "🪟",
    route: "modal",
    enabled: true,
    badgeVariant: "secondary",
  },

  [SubtaskType.LIST_ACTIONS_AND_PAGINATION]: {
    type: SubtaskType.LIST_ACTIONS_AND_PAGINATION,
    label: "List Actions and Pagination",
    description: "List of actions and pagination",
    icon: "📊",
    route: "list-actions-and-pagination",
    enabled: true,
    badgeVariant: "default",
  },

  [SubtaskType.SIMPLE_FORM]: {
    type: SubtaskType.SIMPLE_FORM,
    label: "Simple Form",
    description: "Basic form with swagger path and description",
    icon: "📄",
    route: "simple-form",
    enabled: true,
    badgeVariant: "outline",
  },

  [SubtaskType.PAGE]: {
    type: SubtaskType.PAGE,
    label: "Page",
    description: "Inquiry or portal page with translations",
    icon: "📃",
    route: "page",
    enabled: true,
    badgeVariant: "secondary",
  },
};

/**
 * Get configuration for a specific subtask type
 */
export function getTypeConfig(type: SubtaskType): SubtaskTypeConfig {
  return SUBTASK_TYPE_CONFIG[type ?? SubtaskType.GENERIC];
}
