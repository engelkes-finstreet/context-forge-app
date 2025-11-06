"use client";

import { Form } from "@/components/forms/form";
import { useEditTaskFormConfig } from "@/features/tasks/components/forms/edit-task/edit-task-form-config";
import { TaskFormFields } from "@/features/tasks/components/forms/task-form-fields";
import { Task } from "@prisma/client";

interface EditTaskFormProps {
  task: Task;
}

export function EditTaskForm({ task }: EditTaskFormProps) {
  const formConfig = useEditTaskFormConfig({
    task,
  });
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <TaskFormFields fieldNames={fieldNames} />
    </Form>
  );
}
