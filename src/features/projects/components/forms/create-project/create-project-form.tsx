"use client";

import { Form } from "@/components/forms/form";
import { useCreateProjectFormConfig } from "@/features/projects/components/forms/create-project/create-project-form-config";
import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldDefinitionBuilder } from "@/features/projects/components/custom-fields";
import { useFormContext } from "react-hook-form";
import { CreateProjectInput } from "./create-project-form-schema";
import { Separator } from "@/components/ui/separator";

export function CreateProjectForm() {
  const formConfig = useCreateProjectFormConfig();
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <div className="space-y-6">
        <DynamicFormField fieldName={fieldNames.name} />
        <DynamicFormField fieldName={fieldNames.description} />
        <DynamicFormField fieldName={fieldNames.githubRepo} />
        <DynamicFormField fieldName={fieldNames.swaggerPath} />

        <Separator className="my-6" />

        <CustomFieldsSection />
      </div>
    </Form>
  );
}

/**
 * Custom fields section component that connects to form context
 */
function CustomFieldsSection() {
  const { watch, setValue } = useFormContext<CreateProjectInput>();
  const customFieldDefinitions = watch("customFieldDefinitions");

  const handleFieldsChange = (fields: any[]) => {
    setValue("customFieldDefinitions", { fields }, { shouldValidate: true });
  };

  return (
    <FieldDefinitionBuilder
      fields={customFieldDefinitions?.fields || []}
      onChange={handleFieldsChange}
    />
  );
}
