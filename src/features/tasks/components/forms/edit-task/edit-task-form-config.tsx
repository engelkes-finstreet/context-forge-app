import { DeepPartial } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createFormFieldNames } from '@/components/forms/utils/create-form-field-names';
import { Button } from '@/components/ui/button';
import { updateTaskSchema, UpdateTaskInput } from '@/lib/validations/task-schema';
import { updateTaskAction, TaskFormState } from '@/lib/actions/task-actions';
import { FormConfig, FormFieldsType } from '@/components/forms/types';
import { z } from 'zod';
import { routes } from '@/lib/routes';

const editTaskFormId = 'edit-task-form';

// Extended schema for the edit form that includes metadata
const editTaskSchema = updateTaskSchema.extend({
  id: z.string().cuid(),
  projectId: z.string().cuid(),
});

type EditTaskInput = z.infer<typeof editTaskSchema>;

interface UseEditTaskFormConfigProps {
  taskId: string;
  projectId: string;
  defaultValues: {
    name: string;
    sharedContext: string;
  };
}

export function useEditTaskFormConfig({
  taskId,
  projectId,
  defaultValues: initialValues,
}: UseEditTaskFormConfigProps): FormConfig<TaskFormState, EditTaskInput> {
  const router = useRouter();

  const defaultValues: DeepPartial<EditTaskInput> = {
    id: taskId,
    projectId,
    name: initialValues.name,
    sharedContext: initialValues.sharedContext,
  };

  const fields: FormFieldsType<EditTaskInput> = {
    id: {
      type: 'hidden',
    },
    projectId: {
      type: 'hidden',
    },
    name: {
      type: 'input',
      inputType: 'text',
      label: 'Task Name',
      placeholder: 'Enter task name',
    },
    sharedContext: {
      type: 'textarea',
      label: 'Shared Context',
      placeholder: 'Enter shared context for all subtasks (supports Markdown)',
      description: 'This context will be accessible by all subtasks within this task',
    },
  };

  return {
    fields,
    defaultValues,
    schema: editTaskSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: updateTaskAction,
    formId: editTaskFormId,
    useErrorAction: () => {
      return (state: TaskFormState) => {
        toast.error(state?.error || 'Something went wrong. Please try again.');
      };
    },
    useSuccessAction: () => {
      return (state: TaskFormState) => {
        toast.success(state?.message || 'Task updated successfully');
        router.push(routes.projects.tasks.detail.path({ projectId, taskId }));
      };
    },
    renderFormActions: (isPending: boolean) => {
      return (
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} form={editTaskFormId}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      );
    },
  };
}
