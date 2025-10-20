import { DeepPartial } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createFormFieldNames } from '@/components/forms/utils/create-form-field-names';
import { Button } from '@/components/ui/button';
import { createSubtaskSchema, CreateSubtaskInput } from '@/lib/validations/subtask-schema';
import { createSubtaskAction, SubtaskFormState } from '@/lib/actions/subtask-actions';
import { FormConfig, FormFieldsType } from '@/components/forms/types';

const createSubtaskFormId = 'create-subtask-form';

export function useCreateSubtaskFormConfig(taskId: string): FormConfig<SubtaskFormState, CreateSubtaskInput> {
  const router = useRouter();

  const defaultValues: DeepPartial<CreateSubtaskInput> = {
    taskId,
    name: '',
    content: '',
  };

  const fields: FormFieldsType<CreateSubtaskInput> = {
    taskId: {
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
    schema: createSubtaskSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createSubtaskAction,
    formId: createSubtaskFormId,
    useErrorAction: () => {
      return (state: SubtaskFormState) => {
        toast.error(state?.error || 'Something went wrong. Please try again.');
      };
    },
    useSuccessAction: () => {
      return (state: SubtaskFormState) => {
        toast.success(state?.message || 'Subtask created successfully');
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
          <Button
            type="submit"
            disabled={isPending}
            form={createSubtaskFormId}
          >
            {isPending ? 'Creating...' : 'Create Subtask'}
          </Button>
        </div>
      );
    },
  };
}
