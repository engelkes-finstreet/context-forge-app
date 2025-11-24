import { FormFieldsType } from "@/components/forms/types";
import {
  CreatePageSubtaskFormInput,
  UpdatePageSubtaskFormInput,
} from "@/features/subtasks/forms/page-subtask/page-subtask-form-schema";
import { usePageTypeOptions } from "@/features/subtasks/forms/page-subtask/use-page-type-options";

export function useCreatePageSubtaskFormFields(): FormFieldsType<CreatePageSubtaskFormInput> {
  const pageTypeOptions = usePageTypeOptions();

  return {
    taskId: {
      type: "hidden",
    },
    pageName: {
      type: "input",
      label: "Page Name",
      placeholder: "Enter page name",
    },
    metadata: {
      pageType: {
        type: "switch",
        label: "Page Type",
        options: pageTypeOptions,
      },
      translations: {
        title: {
          type: "input",
          label: "Title Translation Key",
          placeholder: "e.g., pages.myPage.title",
        },
        description: {
          type: "input",
          label: "Description Translation Key",
          placeholder: "e.g., pages.myPage.description",
          tooltip: "Required for inquiry pages only",
        },
      },
    },
  };
}

export function useUpdatePageSubtaskFormFields(): FormFieldsType<UpdatePageSubtaskFormInput> {
  return {
    ...useCreatePageSubtaskFormFields(),
    subtaskId: {
      type: "hidden",
    },
  };
}
