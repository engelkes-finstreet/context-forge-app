"use client";

import { CustomFieldDefinition } from "@/lib/types/custom-fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, MoveUp, MoveDown } from "lucide-react";

interface FieldDefinitionItemProps {
  field: CustomFieldDefinition;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

/**
 * Displays a single custom field definition with edit/delete/reorder actions
 */
export function FieldDefinitionItem({
  field,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: FieldDefinitionItemProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">{field.label}</h4>
              <Badge variant={field.required ? "default" : "secondary"}>
                {field.required ? "Required" : "Optional"}
              </Badge>
              <Badge variant="outline">
                {field.type === "input" ? "Text Input" : "Select"}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground">
              Field name: <code className="text-xs bg-muted px-1 py-0.5 rounded">{field.name}</code>
            </p>

            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}

            {field.type === "select" && field.options && (
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs text-muted-foreground">Options:</span>
                {field.options.map((option, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {option}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Move up/down buttons */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onMoveUp}
              disabled={isFirst}
              title="Move up"
            >
              <MoveUp className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onMoveDown}
              disabled={isLast}
              title="Move down"
            >
              <MoveDown className="h-4 w-4" />
            </Button>

            {/* Edit button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onEdit}
              title="Edit field"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            {/* Delete button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onDelete}
              title="Delete field"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
