import { DeepPartial } from 'react-hook-form';
import { toast } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import { createFormFieldNames } from '@/components/forms/utils/create-form-field-names';
import { Button } from '@/components/ui/button';
import { updateProjectSchema, UpdateProjectInput } from './edit-project-form-schema';
import { updateProjectAction, ProjectFormState } from '@/lib/actions/project-actions';
import { FormConfig, FormFieldsType } from '@/components/forms/types';
import { z } from 'zod';
import { routes } from '@/lib/routes';

const editProjectFormId = 'edit-project-form';

// Extended schema for the edit form that includes metadata
const editProjectSchema = updateProjectSchema.extend({
  id: z.string().cuid(),
});

type EditProjectInput = z.infer<typeof editProjectSchema>;

interface UseEditProjectFormConfigProps {
  projectId: string;
  defaultValues: {
    name: string;
    description: string | null;
    githubRepo: string | null;
    swaggerPath: string | null;
  };
}

export function useEditProjectFormConfig({
  projectId,
  defaultValues: initialValues,
}: UseEditProjectFormConfigProps): FormConfig<ProjectFormState, EditProjectInput> {
  const router = useRouter();

  const defaultValues: DeepPartial<EditProjectInput> = {
    id: projectId,
    name: initialValues.name,
    description: initialValues.description || '',
    githubRepo: initialValues.githubRepo || '',
    swaggerPath: initialValues.swaggerPath || '',
  };

  const fields: FormFieldsType<EditProjectInput> = {
    id: {
      type: 'hidden',
    },
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
    githubRepo: {
      type: 'input',
      inputType: 'text',
      label: 'GitHub Repository (optional)',
      placeholder: 'e.g., owner/repo-name',
    },
    swaggerPath: {
      type: 'input',
      inputType: 'text',
      label: 'Swagger File Path (optional)',
      placeholder: 'e.g., docs/swagger.yaml',
    },
  };

  return {
    fields,
    defaultValues,
    schema: editProjectSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: updateProjectAction,
    formId: editProjectFormId,
    useErrorAction: () => {
      return (state: ProjectFormState) => {
        toast.error(state?.error || 'Something went wrong. Please try again.');
      };
    },
    useSuccessAction: () => {
      return (state: ProjectFormState) => {
        toast.success(state?.message || 'Project updated successfully');
        router.push(routes.projects.detail.path({ projectId }));
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
          <Button type="submit" disabled={isPending} form={editProjectFormId}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      );
    },
  };
}
