"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomFieldDefinition } from "@/lib/types/custom-fields";
import { SelectOptionsManager } from "./select-options-manager";

const fieldFormSchema = z
  .object({
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
    type: z.enum(["input", "select"]),
    required: z.boolean().default(false),
    placeholder: z.string().max(200).optional(),
    description: z.string().max(500).optional(),
    options: z.array(z.string().min(1)).optional(),
  })
  .refine(
    (data) => {
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

type FieldFormValues = z.infer<typeof fieldFormSchema>;

interface FieldDefinitionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (field: Omit<CustomFieldDefinition, "id" | "order">) => void;
  field?: CustomFieldDefinition;
  existingFieldNames: string[];
}

/**
 * Dialog for adding or editing a custom field definition
 */
export function FieldDefinitionFormDialog({
  open,
  onOpenChange,
  onSave,
  field,
  existingFieldNames,
}: FieldDefinitionFormDialogProps) {
  const isEditing = !!field;

  const form = useForm<FieldFormValues>({
    resolver: zodResolver(fieldFormSchema),
    defaultValues: {
      name: field?.name || "",
      label: field?.label || "",
      type: field?.type || "input",
      required: field?.required || false,
      placeholder: field?.placeholder || "",
      description: field?.description || "",
      options: field?.options || [],
    },
  });

  // Reset form when dialog opens/closes or field changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: field?.name || "",
        label: field?.label || "",
        type: field?.type || "input",
        required: field?.required || false,
        placeholder: field?.placeholder || "",
        description: field?.description || "",
        options: field?.options || [],
      });
    }
  }, [open, field, form]);

  const fieldType = form.watch("type");

  const onSubmit = (data: FieldFormValues) => {
    // Check for duplicate field names (excluding current field when editing)
    if (!isEditing || data.name !== field?.name) {
      if (existingFieldNames.includes(data.name)) {
        form.setError("name", {
          message: "A field with this name already exists",
        });
        return;
      }
    }

    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Custom Field" : "Add Custom Field"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the custom field definition."
              : "Create a new custom field that will be added to all subtasks in this project."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Field Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., featureName, role, product"
                    />
                  </FormControl>
                  <FormDescription>
                    Internal name used to store the data (camelCase, no spaces)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Field Label */}
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Label</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Feature Name, Role, Product"
                    />
                  </FormControl>
                  <FormDescription>
                    Label shown in forms and UI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Field Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="input">Text Input</SelectItem>
                      <SelectItem value="select">Select Dropdown</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How users will enter data for this field
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Required Checkbox */}
            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Required</FormLabel>
                    <FormDescription>
                      Users must fill this field when creating a subtask
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Placeholder */}
            <FormField
              control={form.control}
              name="placeholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placeholder Text (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Enter feature name..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Help Text (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Additional help text shown below the field"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Options for Select fields */}
            {fieldType === "select" && (
              <FormField
                control={form.control}
                name="options"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Options</FormLabel>
                    <FormControl>
                      <SelectOptionsManager
                        options={field.value || []}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Add options for users to choose from
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update Field" : "Add Field"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
