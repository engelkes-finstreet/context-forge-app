import { DeepPartial } from "react-hook-form";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { FormState } from "@/components/forms/types";
import { FormConfig } from "@/components/forms/types";
import { routes } from "@/lib/routes";
import {
  CreateProjectInput,
  createProjectSchema,
} from "@/features/projects/components/forms/project/project-form-schema";
import { useCreateProjectFormFields } from "@/features/projects/components/forms/project/use-project-form-fields";
import { createProjectFormAction } from "@/features/projects/components/forms/project/project-form-action";

const createProjectFormId = "create-project-form";

export function useCreateProjectFormConfig(): FormConfig<
  FormState,
  CreateProjectInput
> {
  const router = useRouter();
  const fields = useCreateProjectFormFields();

  const defaultValues: DeepPartial<CreateProjectInput> = {
    name: "",
    description: "",
    feGithubRepo: "",
    routesPath: "",
    beGithubRepo: "",
    swaggerPath: "",
  };

  return {
    fields,
    defaultValues,
    schema: createProjectSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createProjectFormAction,
    formId: createProjectFormId,
    useErrorAction: () => {
      return (state: FormState) => {
        toast.error(state?.error || "Something went wrong. Please try again.");
      };
    },
    useSuccessAction: () => {
      return (state: FormState) => {
        toast.success(state?.message || "Project created successfully");
        router.push(routes.projects.list.path({}));
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
          <Button type="submit" disabled={isPending} form={createProjectFormId}>
            {isPending ? "Creating..." : "Create Project"}
          </Button>
        </div>
      );
    },
  };
}
