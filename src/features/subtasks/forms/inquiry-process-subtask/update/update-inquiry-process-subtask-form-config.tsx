import { FormConfig, FormState } from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { updateInquiryProcessSubtaskFormAction } from "@/features/subtasks/forms/inquiry-process-subtask/inquiry-process-subtask-form-action";
import {
  UpdateInquiryProcessSubtaskFormInput,
  updateInquiryProcessSubtaskFormSchema,
  Step,
  ProgressBarGroup,
} from "@/features/subtasks/forms/inquiry-process-subtask/inquiry-process-subtask-form-schema";
import { useUpdateInquiryProcessSubtaskFormFields } from "@/features/subtasks/forms/inquiry-process-subtask/use-inquiry-process-subtask-form-fields";
import { Subtask } from "@prisma/client";
import { useRouter } from "next/navigation";
import { DeepPartial } from "react-hook-form";

export function useUpdateInquiryProcessSubtaskFormConfig(
  subtask: Subtask,
): FormConfig<FormState, UpdateInquiryProcessSubtaskFormInput> {
  const router = useRouter();
  const fields = useUpdateInquiryProcessSubtaskFormFields();

  const metadata = subtask.metadata
    ? JSON.parse(subtask.metadata as string)
    : null;

  const defaultValues: DeepPartial<UpdateInquiryProcessSubtaskFormInput> = {
    subtaskId: subtask.id,
    subtaskName: subtask.name,
    taskId: subtask.taskId,
    inquiryRoute: metadata?.inquiryRoute || "",
    steps: metadata?.steps
      ? metadata.steps.map((step: Step) => ({
          name: step.name,
          routeName: step.routeName,
          title: step.title,
          description: step.description,
        }))
      : [],
    progressBar: metadata?.progressBar
      ? metadata.progressBar.map((group: ProgressBarGroup) => ({
          groupTitle: group.groupTitle,
        }))
      : [],
  };

  return {
    fields,
    defaultValues,
    schema: updateInquiryProcessSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: updateInquiryProcessSubtaskFormAction,
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
            {isPending ? "Updating..." : "Update Subtask"}
          </Button>
        </div>
      );
    },
  };
}
