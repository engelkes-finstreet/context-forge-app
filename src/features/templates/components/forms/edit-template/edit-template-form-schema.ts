import { z } from "zod";
import { createTemplateSchema } from "../create-template/create-template-form-schema";

/**
 * Schema for editing a task template
 * Same as create but with templateId
 */
export const editTemplateSchema = createTemplateSchema.extend({
  id: z.cuid("Invalid template ID"),
});

export type EditTemplateInput = z.infer<typeof editTemplateSchema>;
