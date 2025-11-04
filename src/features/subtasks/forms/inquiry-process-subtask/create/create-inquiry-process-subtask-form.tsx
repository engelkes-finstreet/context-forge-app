"use client";

import { Form } from "@/components/forms/form";
import { useCreateInquiryProcessSubtaskFormConfig } from "@/features/subtasks/forms/inquiry-process-subtask/create/create-inquiry-process-subtask-form-config";
import { InquiryProcessSubtaskFormFields } from "@/features/subtasks/forms/inquiry-process-subtask/inquiry-process-subtask-form-fields";

type Props = {
  taskId: string;
};

export const CreateInquiryProcessSubtaskForm = ({ taskId }: Props) => {
  const formConfig = useCreateInquiryProcessSubtaskFormConfig(taskId);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <InquiryProcessSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
