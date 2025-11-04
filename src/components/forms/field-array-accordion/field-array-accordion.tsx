"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { FieldArrayAccordionProps } from "./types";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Reusable component for rendering array fields with accordion UI pattern.
 *
 * Features:
 * - Ensures minimum items (default: 1)
 * - Accordion-based UI for each item with expand/collapse
 * - Auto-expands newly added items
 * - Smart remove logic: resets last item instead of removing
 * - Delete button positioned outside accordion
 * - Flexible render functions for custom summary and content
 *
 * @example
 * ```tsx
 * <FieldArrayAccordion
 *   arrayFieldName="requests"
 *   arrayFieldConfig={fieldNames.requests}
 *   defaultItem={{ endpoint: "", requestType: undefined, paginated: false }}
 *   itemLabel="Request"
 *   renderSummary={({ item, index }) => (
 *     <RequestSummary request={item} />
 *   )}
 * >
 *   {({ index, fieldNames, buildFieldName }) => (
 *     <>
 *       <DynamicFormField fieldName={buildFieldName(fieldNames.endpoint)} />
 *       <DynamicFormField fieldName={buildFieldName(fieldNames.requestType)} />
 *     </>
 *   )}
 * </FieldArrayAccordion>
 * ```
 */
export function FieldArrayAccordion<TItem extends Record<string, any>>({
  arrayFieldName,
  arrayFieldConfig,
  defaultItem,
  itemLabel,
  children,
  renderSummary,
  minItems = 1,
  maxItems,
  addButtonText,
  showItemNumber = true,
  className,
  sectionTitle,
  showCount = true,
}: FieldArrayAccordionProps<TItem>) {
  const {
    fields: fieldsArray,
    append,
    remove,
    update,
  } = useFieldArray({
    name: arrayFieldName,
  });

  const [openItems, setOpenItems] = useState<string[]>([]);

  // Only add empty first item if array is empty - don't auto-expand
  useEffect(() => {
    if (fieldsArray.length === 0 && minItems > 0) {
      append(defaultItem);
    }
  }, [fieldsArray.length, append, defaultItem, minItems]);

  const handleRemove = (index: number) => {
    const itemValue = `${arrayFieldName}-${index}`;
    setOpenItems((prev) => prev.filter((item) => item !== itemValue));

    if (fieldsArray.length <= minItems) {
      update(index, defaultItem);
    } else {
      remove(index);
    }
  };

  const handleAdd = () => {
    const newIndex = fieldsArray.length;
    append(defaultItem);
    setOpenItems((prev) => [...prev, `${arrayFieldName}-${newIndex}`]);
  };

  const buildFieldName = (index: number, fieldKey: string): string => {
    return `${arrayFieldName}.${index}.${fieldKey}`;
  };

  const canAddMore = maxItems === undefined || fieldsArray.length < maxItems;
  const finalAddButtonText = addButtonText || `Add ${itemLabel}`;

  return (
    <div className={cn("space-y-4", className)}>
      {(sectionTitle || showCount) && (
        <div className="flex items-center justify-between">
          {sectionTitle && (
            <h3 className="text-sm font-semibold">{sectionTitle}</h3>
          )}
          {showCount && (
            <span className="text-xs text-muted-foreground">
              {fieldsArray.length}{" "}
              {fieldsArray.length === 1 ? itemLabel.toLowerCase() : `${itemLabel.toLowerCase()}s`}
            </span>
          )}
        </div>
      )}

      <Accordion
        type="multiple"
        className="space-y-2"
        value={openItems}
        onValueChange={setOpenItems}
      >
        {fieldsArray.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <AccordionItem
              value={`${arrayFieldName}-${index}`}
              className="border rounded-lg flex-1"
            >
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-3 flex-1">
                  {showItemNumber && (
                    <span className="text-xs font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                  )}
                  {renderSummary({
                    index,
                    fieldNames: arrayFieldConfig.fields,
                    buildFieldName: (fieldKey: string) =>
                      buildFieldName(index, fieldKey),
                    item: field,
                  })}
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4 pt-2">
                  {children({
                    index,
                    fieldNames: arrayFieldConfig.fields,
                    buildFieldName: (fieldKey: string) =>
                      buildFieldName(index, fieldKey),
                    item: field,
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            <Button
              onClick={() => handleRemove(index)}
              variant="ghost"
              size="icon"
              type="button"
              className="size-9 shrink-0 mt-1"
              aria-label={`Remove ${itemLabel} ${index + 1}`}
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        ))}
      </Accordion>

      {canAddMore && (
        <Button
          onClick={handleAdd}
          variant="outline"
          size="sm"
          className="w-full border-dashed"
          type="button"
        >
          <PlusIcon className="size-4 mr-2" />
          {finalAddButtonText}
        </Button>
      )}
    </div>
  );
}
