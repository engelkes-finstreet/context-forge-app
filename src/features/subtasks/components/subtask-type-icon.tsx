"use client";

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
  type LucideIcon,
} from "lucide-react";
import { getTypeConfig } from "@/features/subtasks/config/type-config";

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

interface SubtaskTypeIconProps {
  type: SubtaskType;
  className?: string;
}

/**
 * Renders the appropriate Lucide icon for a subtask type
 */
export function SubtaskTypeIcon({ type, className = "h-3 w-3" }: SubtaskTypeIconProps) {
  const config = getTypeConfig(type);
  const Icon = ICON_MAP[config.icon] || FileText;
  return <Icon className={className} />;
}

/**
 * Get the Lucide icon component for a subtask type
 */
export function getSubtaskTypeIcon(type: SubtaskType): LucideIcon {
  const config = getTypeConfig(type);
  return ICON_MAP[config.icon] || FileText;
}
