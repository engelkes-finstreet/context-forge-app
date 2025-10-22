import { DeepPartial } from 'react-hook-form';
import { toast } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import { createFormFieldNames } from '@/components/forms/utils/create-form-field-names';
import { Button } from '@/components/ui/button';
import { createProjectSchema, CreateProjectInput } from './create-project-form-schema';
import { createProjectAction, ProjectFormState } from '@/lib/actions/project-actions';
import { FormConfig, FormFieldsType } from '@/components/forms/types';
import { routes } from '@/lib/routes';

const createProjectFormId = 'create-project-form';

export function useCreateProjectFormConfig(): FormConfig<ProjectFormState, CreateProjectInput> {
  const router = useRouter();

  const defaultValues: DeepPartial<CreateProjectInput> = {
    name: '',
    description: '',
  };

  const fields: FormFieldsType<CreateProjectInput> = {
    name: {
      type: 'input',
      inputType: 'text',
      label: 'Project Name',
      placeholder: 'Enter project name',
    },
    description: {
      type: 'textarea',
      label: 'Description (optional)',
      placeholder: 'Enter project description',
    },
  };

  return {
    fields,
    defaultValues,
    schema: createProjectSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createProjectAction,
    formId: createProjectFormId,
    useErrorAction: () => {
      return (state: ProjectFormState) => {
        toast.error(state?.error || 'Something went wrong. Please try again.');
      };
    },
    useSuccessAction: () => {
      return (state: ProjectFormState) => {
        toast.success(state?.message || 'Project created successfully');
        router.push(routes.projects.list.path());
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
            form={createProjectFormId}
          >
            {isPending ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      );
    },
  };
}
