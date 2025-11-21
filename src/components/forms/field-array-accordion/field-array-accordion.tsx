"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
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
  const newlyAddedIndexRef = useRef<number | null>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  // Add first item and auto-expand when creating new form
  useEffect(() => {
    if (fieldsArray.length === 0 && minItems > 0) {
      append(defaultItem);
    }
  }, [fieldsArray.length, append, defaultItem, minItems, arrayFieldName]);

  useEffect(() => {
    if (fieldsArray.length === 1) {
      setOpenItems([`${arrayFieldName}-0`]);
    }
  }, [fieldsArray.length, arrayFieldName]);

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
    newlyAddedIndexRef.current = newIndex;
    append(defaultItem);
    // Collapse all other items, only expand the newly added one
    setOpenItems([`${arrayFieldName}-${newIndex}`]);
  };

  // Focus first form element in newly added accordion item
  useEffect(() => {
    if (newlyAddedIndexRef.current === null || !accordionRef.current) return;

    const newIndex = newlyAddedIndexRef.current;
    const itemValue = `${arrayFieldName}-${newIndex}`;

    // Check if the newly added item is open
    if (openItems.includes(itemValue)) {
      // Wait for accordion animation to complete
      const timeoutId = setTimeout(() => {
        if (!accordionRef.current) return;

        // Find all accordion items and get the one at the new index
        const accordionItems = accordionRef.current.querySelectorAll(
          '[data-slot="accordion-item"]',
        );
        const newAccordionItem = accordionItems[newIndex];

        if (newAccordionItem) {
          // Find the first focusable form element within this accordion item
          const firstFocusable = newAccordionItem.querySelector(
            'input:not([type="hidden"]), button[role="combobox"], textarea, select',
          ) as HTMLElement;

          if (firstFocusable) {
            firstFocusable.focus();
          }
        }

        newlyAddedIndexRef.current = null;
      }, 150); // Delay to ensure accordion animation completes

      return () => clearTimeout(timeoutId);
    }
  }, [openItems, arrayFieldName]);

  const buildFieldName = (index: number, fieldKey: string): string => {
    return `${arrayFieldName}.${index}.${fieldKey}`;
  };

  const canAddMore = maxItems === undefined || fieldsArray.length < maxItems;
  const finalAddButtonText = addButtonText || `Add ${itemLabel}`;

  return (
    <div className={cn("space-y-4", className)}>
      {(sectionTitle || showCount) && (
        <div className="flex items-center justify-between pb-1">
          {sectionTitle && (
            <h3 className="text-sm font-semibold text-foreground/90 dark:text-foreground">
              {sectionTitle}
            </h3>
          )}
          {showCount && (
            <span className="text-xs font-medium text-muted-foreground/80 dark:text-muted-foreground">
              {fieldsArray.length}{" "}
              {fieldsArray.length === 1
                ? itemLabel.toLowerCase()
                : `${itemLabel.toLowerCase()}s`}
            </span>
          )}
        </div>
      )}

      <Accordion
        type="multiple"
        className="space-y-3"
        value={openItems}
        onValueChange={setOpenItems}
        ref={accordionRef}
      >
        {fieldsArray.map((field, index) => (
          <div key={field.id} className="flex items-start gap-3">
            <AccordionItem
              value={`${arrayFieldName}-${index}`}
              className="border flex-1 bg-card rounded-xl shadow-sm hover:shadow-md transition-all border-border/40 dark:border-border dark:bg-transparent"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 dark:hover:bg-muted/40 rounded-t-xl transition-colors data-[state=open]:border-b data-[state=open]:border-border/50 dark:data-[state=open]:border-border dark:bg-muted/30">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {showItemNumber && (
                    <span className="text-xs font-semibold text-muted-foreground shrink-0 dark:text-muted-foreground/90">
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

              <AccordionContent className="px-5 pb-5">
                <div className="space-y-4 pt-4">
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
              className="size-9 shrink-0 mt-2.5 hover:bg-destructive/10 hover:text-destructive transition-colors dark:hover:bg-destructive/20"
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
          className="w-full border-dashed border-2 hover:bg-muted/50 transition-colors dark:border-border/60 dark:hover:bg-muted/30"
          type="button"
        >
          <PlusIcon className="size-4 mr-2" />
          {finalAddButtonText}
        </Button>
      )}
    </div>
  );
}
