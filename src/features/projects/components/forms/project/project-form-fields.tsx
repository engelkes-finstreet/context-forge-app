import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateProjectInput } from "@/features/projects/components/forms/project/project-form-schema";

type Props = {
  fieldNames: FieldNamesType<FormFieldsType<CreateProjectInput>>;
};

export const ProjectFormFields = ({ fieldNames }: Props) => {
  return (
    <div className="space-y-6">
      <DynamicFormField fieldName={fieldNames.name} />
      <DynamicFormField fieldName={fieldNames.description} />
      <DynamicFormField fieldName={fieldNames.feGithubRepo} />
      <DynamicFormField fieldName={fieldNames.routesPath} />
      <DynamicFormField fieldName={fieldNames.beGithubRepo} />
      <DynamicFormField fieldName={fieldNames.swaggerPath} />
    </div>
  );
};
