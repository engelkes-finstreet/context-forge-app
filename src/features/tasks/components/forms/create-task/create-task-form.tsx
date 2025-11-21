"use client";

import { Form } from "@/components/forms/form";
import { useCreateTaskFormConfig } from "@/features/tasks/components/forms/create-task/create-task-form-config";
import { TaskFormFields } from "@/features/tasks/components/forms/task-form-fields";

interface CreateTaskFormProps {
  projectId: string;
}

export function CreateTaskForm({ projectId }: CreateTaskFormProps) {
  const formConfig = useCreateTaskFormConfig(projectId);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <TaskFormFields fieldNames={fieldNames} />
    </Form>
  );
}
