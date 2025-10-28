import { z } from "zod";

const baseFieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  label: z.string().min(1, "Label is required"),
  description: z.string().optional(),
  validation: z.string().min(1, "Validation is required"),
});

const inputFieldSchema = baseFieldSchema.extend({
  fieldType: z.literal("input"),
  placeholder: z.string().optional(),
  inputType: z.enum(["text", "number"]).default("text"),
});

const selectableCardFieldSchema = baseFieldSchema.extend({
  fieldType: z.literal("selectable-card"),
  options: z
    .array(
      z.object({
        label: z.string().min(1, "Label is required"),
        sublabel: z.string().optional(),
      }),
    )
    .min(1, "At least one option is required"),
  multiSelect: z.boolean().default(false),
});

const hiddenFieldSchema = z.object({
  fieldType: z.literal("hidden"),
  name: z.string().min(1, "Field name is required"),
});

const formFieldConfigSchema = z.discriminatedUnion("fieldType", [
  inputFieldSchema,
  selectableCardFieldSchema,
  hiddenFieldSchema,
]);

export const createFormSubtaskFormSchema = z
  .object({
    taskId: z.string().cuid("Invalid task ID"),
    subtaskName: z.string().min(1, "Subtask name is required"),
    fields: z
      .array(formFieldConfigSchema)
      .min(1, "At least one field is required"),
  })
  .superRefine((data, ctx) => {
    // Validate unique field names
    const fieldNames = data.fields.map((f) => f.name);
    const seen = new Set<string>();
    const duplicates: string[] = [];

    for (const name of fieldNames) {
      if (seen.has(name) && !duplicates.includes(name)) {
        duplicates.push(name);
      }
      seen.add(name);
    }

    if (duplicates.length > 0) {
      ctx.addIssue({
        code: "custom",
        message: `Duplicate field names: ${duplicates.join(", ")}`,
        path: ["fields"],
      });
    }
  });

// Export TypeScript types
export type FormFieldConfig = z.infer<typeof formFieldConfigSchema>;
export type InputFieldConfig = z.infer<typeof inputFieldSchema>;
export type SelectableCardFieldConfig = z.infer<
  typeof selectableCardFieldSchema
>;
export type HiddenFieldConfig = z.infer<typeof hiddenFieldSchema>;
export type CreateFormSubtaskFormInput = z.infer<
  typeof createFormSubtaskFormSchema
>;
