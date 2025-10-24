"use client";

import { Form } from "@/components/forms/form";
import { useEditTaskFormConfig } from "@/features/tasks/components/forms/edit-task/edit-task-form-config";
import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";

interface EditTaskFormProps {
  taskId: string;
  projectId: string;
  defaultValues: {
    name: string;
    sharedContext: string;
  };
}

export function EditTaskForm({
  taskId,
  projectId,
  defaultValues,
}: EditTaskFormProps) {
  const formConfig = useEditTaskFormConfig({
    taskId,
    projectId,
    defaultValues,
  });
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <div className="space-y-6">
        <DynamicFormField fieldName={fieldNames.name} />
        <DynamicFormField fieldName={fieldNames.sharedContext} />
      </div>
    </Form>
  );
}
