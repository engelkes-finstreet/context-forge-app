import { ReactNode } from "react";

/**
 * Helper utilities provided to the render function
 */
export interface FieldArrayHelpers {
  /** Current item index in the array */
  index: number;
  /** Field name mappings from the array field config (e.g., { name: "name", translation: "translation" }) */
  fieldNames: Record<string, string>;
  /** Helper function to construct full field paths like "columns.0.name" */
  buildFieldName: (fieldKey: string) => string;
}

/**
 * Props for the FieldArraySection component
 * @template TItem - The type of items in the array
 */
export interface FieldArraySectionProps<TItem extends Record<string, any>> {
  /** The field name for useFieldArray (e.g., "columns" or "requests") */
  arrayFieldName: string;

  /** Array field configuration from fieldNames structure */
  arrayFieldConfig: {
    fieldName: string;
    fields: Record<string, string>;
  };

  /** Default item values when adding new items or resetting */
  defaultItem: TItem;

  /** Display label for items (e.g., "Column" or "Request") */
  itemLabel: string;

  /** Render function for the fields inside each array item */
  children: (helpers: FieldArrayHelpers) => ReactNode;

  /** Minimum number of items (default: 1) */
  minItems?: number;

  /** Maximum number of items (optional, no limit by default) */
  maxItems?: number;

  /** Custom text for the add button (default: "Add {itemLabel}") */
  addButtonText?: string;

  /** Whether to show item numbers in headers (default: true) */
  showItemNumber?: boolean;

  /** Additional CSS classes for the container */
  className?: string;

  /**
   * Visual variant for the array section
   * - "standard": Full-width add button, muted header background, standard spacing
   * - "compact": Right-aligned small add button, transparent header, tighter spacing
   * @default "standard"
   */
  variant?: "standard" | "compact";

  /** Optional section title to display above the array items */
  sectionTitle?: string;
}
