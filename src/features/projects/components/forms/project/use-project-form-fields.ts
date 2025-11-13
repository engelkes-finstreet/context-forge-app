import { FormFieldsType } from "@/components/forms/types";
import {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/features/projects/components/forms/project/project-form-schema";

export function useCreateProjectFormFields(): FormFieldsType<CreateProjectInput> {
  return {
    name: {
      type: "input",
      inputType: "text",
      label: "Project Name",
      placeholder: "Enter project name",
    },
    description: {
      type: "textarea",
      label: "Description (optional)",
      placeholder: "Enter project description",
    },
    feGithubRepo: {
      type: "input",
      inputType: "text",
      label: "Frontend GitHub Repository (optional)",
      placeholder: "e.g., owner/repo-name",
    },
    routesPath: {
      type: "input",
      inputType: "text",
      label: "Routes File Path (optional)",
      placeholder: "e.g., routes/routes.ts",
    },
    beGithubRepo: {
      type: "input",
      inputType: "text",
      label: "Backend GitHub Repository (optional)",
      placeholder: "e.g., owner/repo-name",
    },
    swaggerPath: {
      type: "input",
      inputType: "text",
      label: "Swagger File Path (optional)",
      placeholder: "e.g., docs/swagger.yaml",
    },
  };
}

export function useUpdateProjectFormFields(): FormFieldsType<UpdateProjectInput> {
  return {
    ...useCreateProjectFormFields(),
    projectId: {
      type: "hidden",
    },
  };
}
