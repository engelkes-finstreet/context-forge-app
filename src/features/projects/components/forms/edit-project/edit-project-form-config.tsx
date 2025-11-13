import { DeepPartial } from "react-hook-form";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { FormConfig, FormState } from "@/components/forms/types";
import {
  UpdateProjectInput,
  updateProjectSchema,
} from "@/features/projects/components/forms/project/project-form-schema";
import { useUpdateProjectFormFields } from "@/features/projects/components/forms/project/use-project-form-fields";
import { Project } from "@prisma/client";
import { editProjectFormAction } from "@/features/projects/components/forms/project/project-form-action";

export function useEditProjectFormConfig(
  project: Project,
): FormConfig<FormState, UpdateProjectInput> {
  const router = useRouter();
  const fields = useUpdateProjectFormFields();

  const defaultValues: DeepPartial<UpdateProjectInput> = {
    projectId: project.id,
    name: project.name,
    description: project.description ?? undefined,
    feGithubRepo: project.feGithubRepo ?? undefined,
    routesPath: project.routesPath ?? undefined,
    beGithubRepo: project.beGithubRepo ?? undefined,
    swaggerPath: project.swaggerPath ?? undefined,
  };

  return {
    fields,
    defaultValues,
    schema: updateProjectSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: editProjectFormAction,
    useErrorAction: () => {
      return (state: FormState) => {
        toast.error(state?.error || "Something went wrong. Please try again.");
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
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      );
    },
  };
}
