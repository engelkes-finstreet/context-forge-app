"use client";

import { useCreateInquiryProcessSubtaskFormConfig } from "@/features/subtasks/forms/inquiry-process-subtask/create-inquiry-process-subtask-form-config";
import { CreateInquiryProcessSubtaskFormFields } from "@/features/subtasks/forms/inquiry-process-subtask/create-inquiry-process-subtask-form-fields";
import { Form } from "@/components/forms/form";

type Props = {
  taskId: string;
};

export const CreateInquiryProcessSubtaskForm = ({ taskId }: Props) => {
  const formConfig = useCreateInquiryProcessSubtaskFormConfig({ taskId });
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <CreateInquiryProcessSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
