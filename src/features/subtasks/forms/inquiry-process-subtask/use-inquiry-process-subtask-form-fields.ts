import { FormFieldsType } from "@/components/forms/types";
import {
  CreateInquiryProcessSubtaskFormInput,
  UpdateInquiryProcessSubtaskFormInput,
} from "@/features/subtasks/forms/inquiry-process-subtask/inquiry-process-subtask-form-schema";

export function useCreateInquiryProcessSubtaskFormFields(): FormFieldsType<CreateInquiryProcessSubtaskFormInput> {
  return {
    taskId: {
      type: "hidden",
    },
    subtaskName: {
      type: "input",
      label: "Subtask Name",
      placeholder: "Enter subtask name",
    },
    metadata: {
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
    },
  };
}

export function useUpdateInquiryProcessSubtaskFormFields(): FormFieldsType<UpdateInquiryProcessSubtaskFormInput> {
  const fields = useCreateInquiryProcessSubtaskFormFields();
  return {
    ...fields,
    subtaskId: {
      type: "hidden",
    },
  };
}
