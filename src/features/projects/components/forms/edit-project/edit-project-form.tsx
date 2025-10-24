"use client";

import { Form } from "@/components/forms/form";
import { useEditProjectFormConfig } from "@/features/projects/components/forms/edit-project/edit-project-form-config";
import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";

interface EditProjectFormProps {
  projectId: string;
  defaultValues: {
    name: string;
    description: string | null;
    githubRepo: string | null;
    swaggerPath: string | null;
  };
}

export function EditProjectForm({
  projectId,
  defaultValues,
}: EditProjectFormProps) {
  const formConfig = useEditProjectFormConfig({ projectId, defaultValues });
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <div className="space-y-6">
        <DynamicFormField fieldName={fieldNames.name} />
        <DynamicFormField fieldName={fieldNames.description} />
        <DynamicFormField fieldName={fieldNames.githubRepo} />
        <DynamicFormField fieldName={fieldNames.swaggerPath} />
      </div>
    </Form>
  );
}
