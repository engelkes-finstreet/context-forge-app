"use client";

import { FormConfig, FormState } from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { createInquiryProcessSubtaskFormAction } from "@/features/subtasks/forms/inquiry-process-subtask/inquiry-process-subtask-form-action";
import {
  CreateInquiryProcessSubtaskFormInput,
  createInquiryProcessSubtaskFormSchema,
} from "@/features/subtasks/forms/inquiry-process-subtask/inquiry-process-subtask-form-schema";
import { useCreateInquiryProcessSubtaskFormFields } from "@/features/subtasks/forms/inquiry-process-subtask/use-inquiry-process-subtask-form-fields";
import { useRouter } from "next/navigation";
import { DeepPartial } from "react-hook-form";

export function useCreateInquiryProcessSubtaskFormConfig(
  taskId: string,
): FormConfig<FormState, CreateInquiryProcessSubtaskFormInput> {
  const router = useRouter();
  const fields = useCreateInquiryProcessSubtaskFormFields();

  const defaultValues: DeepPartial<CreateInquiryProcessSubtaskFormInput> = {
    taskId,
    subtaskName: "",
    metadata: {
      steps: [
        {
          name: "",
          routeName: "",
          title: "",
          description: "",
        },
      ],
      progressBar: [
        {
          groupTitle: "",
        },
      ],
    },
  };

  return {
    fields,
    defaultValues,
    schema: createInquiryProcessSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createInquiryProcessSubtaskFormAction,
    renderFormActions: (isPending: boolean) => {
      return (
        <div className="flex gap-4 w-full justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Subtask"}
          </Button>
        </div>
      );
    },
  };
}
