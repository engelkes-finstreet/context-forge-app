"use client";

import { Form } from "@/components/forms/form";
import { useCreateGenericSubtaskFormConfig } from "@/features/subtasks/components/forms/generic-subtask/create-subtask-form-config";
import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { SwaggerEndpoint } from "@/lib/services/swagger-service";
import { CustomFieldDefinition } from "@/lib/types/custom-fields";
import { DynamicCustomFields } from "@/components/forms/custom-fields";
import { Separator } from "@/components/ui/separator";

interface CreateGenericSubtaskFormProps {
  taskId: string;
  endpoints: SwaggerEndpoint[];
  customFieldDefinitions?: CustomFieldDefinition[];
}

/**
 * CreateGenericSubtaskForm Component
 *
 * Form for creating a generic subtask (standard subtask with name and content).
 * This is the form displayed after selecting "Generic" type in the type selector.
 */
export function CreateGenericSubtaskForm({
  taskId,
  endpoints,
  customFieldDefinitions = [],
}: CreateGenericSubtaskFormProps) {
  const formConfig = useCreateGenericSubtaskFormConfig(taskId, endpoints);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <div className="space-y-6">
        {/* Hidden fields (taskId, type) are not rendered - only in config */}
        <DynamicFormField fieldName={fieldNames.name} />
        <DynamicFormField fieldName={fieldNames.content} />
        <DynamicFormField fieldName={fieldNames.endpoint} />

        {/* Custom fields from project */}
        {customFieldDefinitions.length > 0 && (
          <>
            <Separator />
            <DynamicCustomFields fieldDefinitions={customFieldDefinitions} />
          </>
        )}
      </div>
    </Form>
  );
}
