import {
  FormConfig,
  FormFieldsType,
  FormState,
} from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { createInquiryProcessSubtaskFormAction } from "@/features/subtasks/forms/inquiry-process-subtask/create-inquiry-process-subtask-form-action";
import {
  CreateInquiryProcessSubtaskFormInput,
  createInquiryProcessSubtaskFormSchema,
} from "@/features/subtasks/forms/inquiry-process-subtask/create-inquiry-process-subtask-form-schema";
import { useRouter } from "next/navigation";
import { DeepPartial } from "react-hook-form";

type Props = {
  taskId: string;
};

export function useCreateInquiryProcessSubtaskFormConfig({
  taskId,
}: Props): FormConfig<FormState, CreateInquiryProcessSubtaskFormInput> {
  const router = useRouter();

  const defaultValues: DeepPartial<CreateInquiryProcessSubtaskFormInput> = {
    taskId,
    subtaskName: "",
    inquiryRoute: "",
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
  };

  const fields: FormFieldsType<CreateInquiryProcessSubtaskFormInput> = {
    taskId: {
      type: "hidden",
    },
    subtaskName: {
      type: "input",
      label: "Subtask Name",
      placeholder: "Enter subtask name",
    },
    inquiryRoute: {
      type: "input",
      label: "Inquiry Route",
      placeholder: "Enter inquiry route",
    },
    steps: {
      type: "array",
      name: {
        type: "input",
        label: "Name",
        placeholder: "Enter name",
      },
      routeName: {
        type: "input",
        label: "Route Name",
        placeholder: "Enter route name",
      },
      title: {
        type: "input",
        label: "Title",
        placeholder: "Enter title",
      },
      description: {
        type: "input",
        label: "Description",
        placeholder: "Enter description",
      },
    },
    progressBar: {
      type: "array",
      groupTitle: {
        type: "input",
        label: "Group Title",
        placeholder: "Enter group title",
      },
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
