import { DeepPartial } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createFormFieldNames } from '@/components/forms/utils/create-form-field-names';
import { Button } from '@/components/ui/button';
import { updateSubtaskSchema, UpdateSubtaskInput } from '@/lib/validations/subtask-schema';
import { updateSubtaskAction, SubtaskFormState } from '@/lib/actions/subtask-actions';
import { FormConfig, FormFieldsType } from '@/components/forms/types';
import { z } from 'zod';
import { routes } from '@/lib/routes';

const editSubtaskFormId = 'edit-subtask-form';

// Extended schema for the edit form that includes metadata
const editSubtaskSchema = updateSubtaskSchema.extend({
  id: z.string().cuid(),
  taskId: z.string().cuid(),
  projectId: z.string().cuid(),
});

type EditSubtaskInput = z.infer<typeof editSubtaskSchema>;

interface UseEditSubtaskFormConfigProps {
  subtaskId: string;
  taskId: string;
  projectId: string;
  defaultValues: {
    name: string;
    content: string;
  };
}

export function useEditSubtaskFormConfig({
  subtaskId,
  taskId,
  projectId,
  defaultValues: initialValues,
}: UseEditSubtaskFormConfigProps): FormConfig<SubtaskFormState, EditSubtaskInput> {
  const router = useRouter();

  const defaultValues: DeepPartial<EditSubtaskInput> = {
    id: subtaskId,
    taskId,
    projectId,
    name: initialValues.name,
    content: initialValues.content,
  };

  const fields: FormFieldsType<EditSubtaskInput> = {
    id: {
      type: 'hidden',
    },
    taskId: {
      type: 'hidden',
    },
    projectId: {
      type: 'hidden',
    },
    name: {
      type: 'input',
      inputType: 'text',
      label: 'Subtask Name',
      placeholder: 'Enter subtask name',
    },
    content: {
      type: 'textarea',
      label: 'Content',
      placeholder: 'Enter subtask content (supports Markdown)',
      description: 'This content is specific to this subtask',
    },
  };

  return {
    fields,
    defaultValues,
    schema: editSubtaskSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: updateSubtaskAction,
    formId: editSubtaskFormId,
    useErrorAction: () => {
      return (state: SubtaskFormState) => {
        toast.error(state?.error || 'Something went wrong. Please try again.');
      };
    },
    useSuccessAction: () => {
      return (state: SubtaskFormState) => {
        toast.success(state?.message || 'Subtask updated successfully');
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
          <Button type="submit" disabled={isPending} form={editSubtaskFormId}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      );
    },
  };
}
