import { z } from "zod";
import { CustomFieldType } from "@/lib/types/custom-fields";

/**
 * Custom Field Validation Schemas
 *
 * Zod schemas for validating custom field definitions and values.
 */

/**
 * Schema for validating a single custom field definition
 */
export const customFieldDefinitionSchema = z
  .object({
    id: z.string().min(1, "Field ID is required"),
    name: z
      .string()
      .min(1, "Field name is required")
      .max(50, "Field name must be less than 50 characters")
      .regex(
        /^[a-zA-Z][a-zA-Z0-9]*$/,
        "Field name must start with a letter and contain only letters and numbers"
      ),
    label: z
      .string()
      .min(1, "Field label is required")
      .max(100, "Field label must be less than 100 characters"),
    type: z.enum(["input", "select"] as const, {
      errorMap: () => ({ message: "Field type must be 'input' or 'select'" }),
    }),
    required: z.boolean().default(false),
    placeholder: z.string().max(200).optional(),
    description: z.string().max(500).optional(),
    order: z.number().int().min(0),
    options: z.array(z.string().min(1)).optional(),
  })
  .refine(
    (data) => {
      // If type is select, options must be provided and have at least one item
      if (data.type === "select") {
        return data.options && data.options.length > 0;
      }
      return true;
    },
    {
      message: "Select fields must have at least one option",
      path: ["options"],
    }
  );

/**
 * Schema for the full project custom fields config
 */
export const projectCustomFieldsConfigSchema = z.object({
  fields: z.array(customFieldDefinitionSchema),
});

/**
 * Type for custom field definition input
 */
export type CustomFieldDefinitionInput = z.infer<
  typeof customFieldDefinitionSchema
>;

/**
 * Type for project custom fields config input
 */
export type ProjectCustomFieldsConfigInput = z.infer<
  typeof projectCustomFieldsConfigSchema
>;

/**
 * Dynamically generates a Zod schema for custom field values based on field definitions
 *
 * @param definitions - Array of custom field definitions
 * @returns Zod schema that validates the custom field values
 */
export function generateCustomFieldValuesSchema(
  definitions: CustomFieldDefinitionInput[]
): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {};

  definitions.forEach((def) => {
    let fieldSchema: z.ZodTypeAny;

    switch (def.type) {
      case "input":
        fieldSchema = z.string().min(1, `${def.label} is required`);
        break;
      case "select":
        if (def.options && def.options.length > 0) {
          fieldSchema = z.enum(
            def.options as [string, ...string[]],
            {
              errorMap: () => ({ message: `Please select a ${def.label}` }),
            }
          );
        } else {
          fieldSchema = z.string();
        }
        break;
      default:
        fieldSchema = z.string();
    }

    // Make optional if not required
    if (!def.required) {
      fieldSchema = fieldSchema.optional().nullable();
    }

    shape[def.name] = fieldSchema;
  });

  return z.object(shape);
}
