'use client';

import { FormConfig, FormFieldsType } from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { CreateRequestSubtaskFormInput, createRequestSubtaskFormSchema } from "@/features/subtasks/components/forms/request-subtask/create-request-subtask-form-schema";
import { SubtaskFormState } from "@/lib/actions/subtask-actions";
import { SwaggerEndpoint } from "@/lib/services/swagger-service";
import { DeepPartial } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createRequestSubtaskFormAction } from "@/features/subtasks/components/forms/request-subtask/create-request-subtask-form-action";

export function useCreateRequestSubtaskFormConfig(taskId: string, endpoints: SwaggerEndpoint[]): FormConfig<SubtaskFormState, CreateRequestSubtaskFormInput> {    
    const router = useRouter();
    
    const defaultValues: DeepPartial<CreateRequestSubtaskFormInput> = {
        taskId,
        name: '',
        requests: [{
            endpoint: '',
            requestType: undefined,
            paginated: undefined,
        }],
    };

    const fields: FormFieldsType<CreateRequestSubtaskFormInput> = {
        taskId: {
            type: 'hidden',
        },
        name: {
            type: 'input',
            inputType: 'text',
            label: 'Subtask Name',
            placeholder: 'Enter subtask name',
        },
        requests: {
            type: 'array',
            endpoint: {
                type: 'swagger_endpoint_selector',
                label: 'Endpoint',
                description: 'Select the API endpoint for this request',
                placeholder: 'Select endpoint...',
                emptyText: 'No endpoints found',
                endpoints,
            },
            requestType: {
                type: "select",
                label: 'Request Type',
                description: 'Select the request type for this request',
                placeholder: 'Select request type...',
                options: [
                    { label: 'Server', value: 'server' },
                    { label: 'Client', value: 'client' },
                ],
            },
            paginated: {
                type: 'checkbox',
                label: 'Paginated',
                description: 'Is this request paginated?',
            },
        }
    };

    return {
        fields,
        defaultValues,
        schema: createRequestSubtaskFormSchema,
        fieldNames: createFormFieldNames(fields),
        serverAction: createRequestSubtaskFormAction,
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
                  <Button
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending ? 'Creating...' : 'Create Subtask'}
                  </Button>
                </div>
              );
        }
    }
}