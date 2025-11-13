"use client";

import { Form } from "@/components/forms/form";
import { useEditProjectFormConfig } from "@/features/projects/components/forms/edit-project/edit-project-form-config";
import { ProjectFormFields } from "@/features/projects/components/forms/project/project-form-fields";
import { Project } from "@prisma/client";

type Props = {
  project: Project;
};

export function EditProjectForm({ project }: Props) {
  const formConfig = useEditProjectFormConfig(project);

  return (
    <Form formConfig={formConfig}>
      <ProjectFormFields fieldNames={formConfig.fieldNames} />
    </Form>
  );
}
