import { ReactNode } from "react";

/**
 * Helper utilities provided to the render function
 */
export interface FieldArrayAccordionHelpers {
  /** Current item index in the array */
  index: number;
  /** Field name mappings from the array field config (e.g., { endpoint: "endpoint", requestType: "requestType" }) */
  fieldNames: Record<string, string>;
  /** Helper function to construct full field paths like "requests.0.endpoint" */
  buildFieldName: (fieldKey: string) => string;
  /** The actual field data/value for rendering summary */
  item: any;
}

/**
 * Props for the FieldArrayAccordion component
 * @template TItem - The type of items in the array
 */
export interface FieldArrayAccordionProps<TItem extends Record<string, any>> {
  /** The field name for useFieldArray (e.g., "requests" or "steps") */
  arrayFieldName: string;

  /** Array field configuration from fieldNames structure */
  arrayFieldConfig: {
    fieldName: string;
    fields: Record<string, string>;
  };

  /** Default item values when adding new items or resetting */
  defaultItem: TItem;

  /** Display label for items (e.g., "Request" or "Step") */
  itemLabel: string;

  /** Render function for the accordion content (fields inside each array item) */
  children: (helpers: FieldArrayAccordionHelpers) => ReactNode;

  /** Render function for the accordion summary/trigger content */
  renderSummary: (helpers: FieldArrayAccordionHelpers) => ReactNode;

  /** Minimum number of items (default: 1) */
  minItems?: number;

  /** Maximum number of items (optional, no limit by default) */
  maxItems?: number;

  /** Custom text for the add button (default: "Add {itemLabel}") */
  addButtonText?: string;

  /** Whether to show item numbers in summary (default: true) */
  showItemNumber?: boolean;

  /** Additional CSS classes for the container */
  className?: string;

  /** Optional section title to display above the array items */
  sectionTitle?: string;

  /** Whether to show a count of items in the section title area (default: true) */
  showCount?: boolean;
}
