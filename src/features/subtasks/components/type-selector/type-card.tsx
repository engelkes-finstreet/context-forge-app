"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubtaskTypeConfig } from "@/features/subtasks/config/type-config";
import { cn } from "@/lib/utils";

interface TypeCardProps {
  config: SubtaskTypeConfig;
  onClick: () => void;
  disabled?: boolean;
}

/**
 * TypeCard Component
 *
 * Displays a clickable card for a subtask type with icon, label, and description.
 * Used in the type selector to choose which type of subtask to create.
 */
export function TypeCard({ config, onClick, disabled = false }: TypeCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:scale-105",
        "border-2 hover:border-primary",
        disabled &&
          "opacity-50 cursor-not-allowed hover:shadow-none hover:scale-100",
      )}
      onClick={() => !disabled && onClick()}
    >
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="text-4xl" aria-hidden="true">
            {config.icon}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{config.label}</CardTitle>
            <CardDescription className="text-sm">
              {config.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
