"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { FieldArraySectionProps } from "./types";
import { cn } from "@/lib/utils";

/**
 * Reusable component for rendering array fields with a consistent UI pattern.
 *
 * Features:
 * - Ensures minimum items (default: 1)
 * - Card-based UI for each item with remove button
 * - Smart remove logic: resets last item instead of removing
 * - Add button with dashed border
 * - Flexible render function for custom fields
 *
 * @example
 * ```tsx
 * <FieldArraySection
 *   arrayFieldName="columns"
 *   arrayFieldConfig={fieldNames.columns}
 *   defaultItem={{ name: "", translation: "", gridTemplateColumns: undefined }}
 *   itemLabel="Column"
 * >
 *   {({ index, fieldNames, buildFieldName }) => (
 *     <>
 *       <DynamicFormField fieldName={buildFieldName(fieldNames.name)} />
 *       <DynamicFormField fieldName={buildFieldName(fieldNames.translation)} />
 *     </>
 *   )}
 * </FieldArraySection>
 * ```
 */
export function FieldArraySection<TItem extends Record<string, any>>({
  arrayFieldName,
  arrayFieldConfig,
  defaultItem,
  itemLabel,
  children,
  minItems = 1,
  maxItems,
  addButtonText,
  showItemNumber = true,
  className,
  variant = "standard",
  sectionTitle,
}: FieldArraySectionProps<TItem>) {
  const {
    fields: fieldsArray,
    append,
    remove,
    update,
  } = useFieldArray({
    name: arrayFieldName,
  });

  useEffect(() => {
    if (fieldsArray.length === 0 && minItems > 0) {
      append(defaultItem);
    }
  }, [fieldsArray, append, defaultItem, minItems]);

  const handleRemove = (index: number) => {
    if (fieldsArray.length <= minItems) {
      update(index, defaultItem);
    } else {
      remove(index);
    }
  };

  const handleAdd = () => {
    append(defaultItem);
  };

  const buildFieldName = (index: number, fieldKey: string): string => {
    return `${arrayFieldName}.${index}.${fieldKey}`;
  };

  const canAddMore = maxItems === undefined || fieldsArray.length < maxItems;
  const finalAddButtonText = addButtonText || `Add ${itemLabel}`;

  const isCompact = variant === "compact";
  const containerSpacing = isCompact ? "space-y-3" : "space-y-4";
  const itemBorder = isCompact
    ? "border border-primary/30"
    : "border border-primary/50";
  const headerBg = isCompact ? "" : "bg-muted";
  const contentPadding = isCompact ? "p-4 pt-0" : "p-4";
  const contentGap = isCompact ? "gap-4" : "gap-6";

  return (
    <div className={cn(isCompact ? "space-y-4" : "space-y-4", className)}>
      {sectionTitle && (
        <div className="text-sm font-semibold">{sectionTitle}</div>
      )}
      <div className={containerSpacing}>
        {fieldsArray.map((field, index) => (
          <div
            key={field.id}
            className={cn(itemBorder, "rounded-md overflow-hidden")}
          >
            <div className={cn("flex items-center justify-between px-4 py-2", headerBg)}>
              <h3 className="text-sm font-medium">
                {itemLabel}
                {showItemNumber && ` ${index + 1}`}
              </h3>
              <Button
                onClick={() => handleRemove(index)}
                variant="ghost"
                size="icon"
                type="button"
                aria-label={`Remove ${itemLabel} ${index + 1}`}
              >
                <XIcon className="size-4" />
              </Button>
            </div>

            <div className={cn("flex flex-col", contentGap, contentPadding)}>
              {children({
                index,
                fieldNames: arrayFieldConfig.fields,
                buildFieldName: (fieldKey: string) =>
                  buildFieldName(index, fieldKey),
              })}
            </div>
          </div>
        ))}
      </div>

      {canAddMore && (
        <div className={isCompact ? "flex justify-end" : ""}>
          <Button
            onClick={handleAdd}
            variant="outline"
            size={isCompact ? "sm" : "default"}
            className={cn(
              "border-dashed",
              isCompact ? "" : "w-full"
            )}
            type="button"
          >
            <PlusIcon className="size-4 mr-2" />
            {finalAddButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}
