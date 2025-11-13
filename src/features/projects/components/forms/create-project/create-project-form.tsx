"use client";

import { Form } from "@/components/forms/form";
import { useCreateProjectFormConfig } from "@/features/projects/components/forms/create-project/create-project-form-config";
import { ProjectFormFields } from "@/features/projects/components/forms/project/project-form-fields";

export function CreateProjectForm() {
  const formConfig = useCreateProjectFormConfig();

  return (
    <Form formConfig={formConfig}>
      <ProjectFormFields fieldNames={formConfig.fieldNames} />
    </Form>
  );
}
