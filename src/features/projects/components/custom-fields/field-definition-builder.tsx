"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  CustomFieldDefinition,
  generateFieldId,
  sortFieldsByOrder,
} from "@/lib/types/custom-fields";
import { FieldDefinitionItem } from "./field-definition-item";
import { FieldDefinitionFormDialog } from "./field-definition-form-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FieldDefinitionBuilderProps {
  fields: CustomFieldDefinition[];
  onChange: (fields: CustomFieldDefinition[]) => void;
}

/**
 * Main component for building and managing custom field definitions
 */
export function FieldDefinitionBuilder({
  fields,
  onChange,
}: FieldDefinitionBuilderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomFieldDefinition | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);

  const sortedFields = sortFieldsByOrder(fields);

  const handleAddField = (fieldData: Omit<CustomFieldDefinition, "id" | "order">) => {
    const newField: CustomFieldDefinition = {
      ...fieldData,
      id: generateFieldId(),
      order: fields.length,
    };
    onChange([...fields, newField]);
  };

  const handleEditField = (fieldData: Omit<CustomFieldDefinition, "id" | "order">) => {
    if (!editingField) return;

    const updatedFields = fields.map((f) =>
      f.id === editingField.id
        ? { ...fieldData, id: f.id, order: f.order }
        : f
    );
    onChange(updatedFields);
    setEditingField(undefined);
  };

  const handleDeleteField = (fieldId: string) => {
    setFieldToDelete(fieldId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!fieldToDelete) return;

    const updatedFields = fields
      .filter((f) => f.id !== fieldToDelete)
      .map((f, idx) => ({ ...f, order: idx })); // Reorder after deletion

    onChange(updatedFields);
    setDeleteDialogOpen(false);
    setFieldToDelete(null);
  };

  const handleMoveUp = (fieldId: string) => {
    const index = sortedFields.findIndex((f) => f.id === fieldId);
    if (index <= 0) return;

    const newFields = [...sortedFields];
    [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];

    // Update orders
    const reorderedFields = newFields.map((f, idx) => ({ ...f, order: idx }));
    onChange(reorderedFields);
  };

  const handleMoveDown = (fieldId: string) => {
    const index = sortedFields.findIndex((f) => f.id === fieldId);
    if (index < 0 || index >= sortedFields.length - 1) return;

    const newFields = [...sortedFields];
    [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];

    // Update orders
    const reorderedFields = newFields.map((f, idx) => ({ ...f, order: idx }));
    onChange(reorderedFields);
  };

  const openAddDialog = () => {
    setEditingField(undefined);
    setDialogOpen(true);
  };

  const openEditDialog = (field: CustomFieldDefinition) => {
    setEditingField(field);
    setDialogOpen(true);
  };

  const existingFieldNames = fields
    .filter((f) => !editingField || f.id !== editingField.id)
    .map((f) => f.name);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Custom Fields for Subtasks</h3>
          <p className="text-sm text-muted-foreground">
            Add custom fields that will appear in all subtasks for this project
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openAddDialog}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>

      {/* List of fields */}
      {sortedFields.length > 0 ? (
        <div className="space-y-2">
          {sortedFields.map((field, idx) => (
            <FieldDefinitionItem
              key={field.id}
              field={field}
              isFirst={idx === 0}
              isLast={idx === sortedFields.length - 1}
              onEdit={() => openEditDialog(field)}
              onDelete={() => handleDeleteField(field.id)}
              onMoveUp={() => handleMoveUp(field.id)}
              onMoveDown={() => handleMoveDown(field.id)}
            />
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            No custom fields defined yet
          </p>
          <Button type="button" variant="outline" onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Field
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <FieldDefinitionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={editingField ? handleEditField : handleAddField}
        field={editingField}
        existingFieldNames={existingFieldNames}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Custom Field</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this field? This action cannot be undone.
              Existing subtasks with this field data will retain their values but the field
              will no longer appear in forms.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
