"use client";

import { Form } from "@/components/forms/form";
import { useUpdateInquiryProcessSubtaskFormConfig } from "@/features/subtasks/forms/inquiry-process-subtask/update/update-inquiry-process-subtask-form-config";
import { InquiryProcessSubtaskFormFields } from "@/features/subtasks/forms/inquiry-process-subtask/inquiry-process-subtask-form-fields";
import { Subtask } from "@prisma/client";

type Props = {
  subtask: Subtask;
};

export const UpdateInquiryProcessSubtaskForm = ({ subtask }: Props) => {
  const formConfig = useUpdateInquiryProcessSubtaskFormConfig(subtask);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <InquiryProcessSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
