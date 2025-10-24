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

  [SubtaskType.INQUIRY_PROCESS]: {
    type: SubtaskType.INQUIRY_PROCESS,
    label: "Inquiry Process",
    description: "Multi-step form wizard with progress tracking",
    icon: "🔄",
    route: "inquiry-process",
    enabled: false, // Disabled for now - will be implemented later
    badgeVariant: "secondary",
  },

  [SubtaskType.FORM]: {
    type: SubtaskType.FORM,
    label: "Form",
    description: "Single form with field definitions and validation",
    icon: "📋",
    route: "form",
    enabled: false, // Disabled for now - will be implemented later
    badgeVariant: "outline",
  },

  [SubtaskType.MODAL]: {
    type: SubtaskType.MODAL,
    label: "Modal",
    description: "Dialog or popup component",
    icon: "🪟",
    route: "modal",
    enabled: false, // Disabled for now - will be implemented later
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
 * Get all enabled subtask types
 */
export function getEnabledTypes(): SubtaskTypeConfig[] {
  return Object.values(SUBTASK_TYPE_CONFIG).filter((config) => config.enabled);
}

/**
 * Check if a subtask type is enabled
 */
export function isTypeEnabled(type: SubtaskType): boolean {
  return SUBTASK_TYPE_CONFIG[type].enabled;
}

/**
 * Get route for a subtask type
 */
export function getTypeRoute(type: SubtaskType): string {
  return SUBTASK_TYPE_CONFIG[type].route;
}
