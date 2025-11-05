import { z } from "zod";

const baseFieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  label: z.string().min(1, "Label is required"),
  validation: z.string().min(1, "Validation is required"),
  placeholder: z.string().optional(),
  renderCondition: z.string().optional(),
  caption: z.string().optional(),
});

const inputFieldSchema = baseFieldSchema.extend({
  fieldType: z.literal("input"),
  suffix: z.string().optional(),
});

const passwordFieldSchema = baseFieldSchema.extend({
  fieldType: z.literal("password"),
});

const textareaFieldSchema = baseFieldSchema.extend({
  fieldType: z.literal("textarea"),
});

const numberFieldSchema = baseFieldSchema.extend({
  fieldType: z.literal("number"),
  suffix: z.string().optional(),
  decimal: z.number().optional(),
});

const dateFieldSchema = baseFieldSchema.extend({
  fieldType: z.literal("datepicker"),
});

const checkboxFieldSchema = baseFieldSchema.extend({
  fieldType: z.literal("checkbox"),
});

const radioFieldSchema = baseFieldSchema.extend({
  fieldType: z.literal("radio-group"),
  radioItems: z.array(
    z.object({
      label: z.string().min(1, "Label is required"),
      value: z.string().min(1, "Value is required"),
    }),
  ),
});

const yesNoRadioSchema = baseFieldSchema.extend({
  fieldType: z.literal("yes-no-radio"),
});

const selectFieldSchema = baseFieldSchema.extend({
  fieldType: z.literal("select"),
  selectItems: z.array(
    z.object({
      label: z.string().min(1, "Label is required"),
      value: z.string().min(1, "Value is required"),
    }),
  ),
});

const comboboxFieldSchema = baseFieldSchema.extend({
  fieldType: z.literal("combobox"),
});

const selectableCardFieldSchema = baseFieldSchema.extend({
  fieldType: z.literal("selectable-card"),
  options: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        label: z.string().min(1, "Label is required"),
        sublabel: z.string().optional(),
      }),
    )
    .min(1, "At least one option is required"),
  multiSelect: z.boolean().default(false),
  description: z.string().optional(),
  validation: z.string().min(1, "Validation is required"),
});

const hiddenFieldSchema = z.object({
  fieldType: z.literal("hidden"),
  name: z.string().min(1, "Field name is required"),
});

const formFieldConfigSchema = z.discriminatedUnion("fieldType", [
  inputFieldSchema,
  selectableCardFieldSchema,
  hiddenFieldSchema,
  passwordFieldSchema,
  textareaFieldSchema,
  numberFieldSchema,
  dateFieldSchema,
  checkboxFieldSchema,
  radioFieldSchema,
  yesNoRadioSchema,
  selectFieldSchema,
  comboboxFieldSchema,
]);

const fieldsArraySchema = z
  .array(formFieldConfigSchema)
  .min(1, "At least one field is required");

export type Fields = z.infer<typeof fieldsArraySchema>;

export const createFormSubtaskFormSchema = z
  .object({
    taskId: z.string().cuid("Invalid task ID"),
    subtaskName: z.string().min(1, "Subtask name is required"),
    fields: fieldsArraySchema,
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

export const updateFormSubtaskFormSchema =
  createFormSubtaskFormSchema.safeExtend({
    subtaskId: z.cuid("Invalid subtask ID"),
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
export type UpdateFormSubtaskFormInput = z.infer<
  typeof updateFormSubtaskFormSchema
>;
