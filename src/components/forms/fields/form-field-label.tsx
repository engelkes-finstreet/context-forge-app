"use client";

import * as React from "react";
import { FormLabel } from "@/components/ui/form";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface FormFieldLabelProps {
  label?: string;
  tooltip?: string;
}

/**
 * Renders a form label with optional tooltip support.
 * If tooltip is provided, displays an info icon next to the label.
 */
export function FormFieldLabel({ label, tooltip }: FormFieldLabelProps) {
  if (!label) {
    return null;
  }

  if (!tooltip) {
    return <FormLabel>{label}</FormLabel>;
  }

  return (
    <div className="flex items-center gap-1.5">
      <FormLabel>{label}</FormLabel>
      <Tooltip>
        <TooltipTrigger type="button" className="cursor-help">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
