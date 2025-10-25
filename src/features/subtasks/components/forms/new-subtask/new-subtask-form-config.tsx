"use client";

import { FormConfig, FormFieldsType } from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import {
  NewSubtaskFormInput,
  newSubtaskFormSchema,
  NewSubtaskFormState,
} from "@/features/subtasks/components/forms/new-subtask/new-subtask-form-schema";
import { toast } from "@/lib/toast";
import { SubtaskType } from "@prisma/client";
import { DeepPartial } from "react-hook-form";
import { useRouter } from "next/navigation";
import { newSubtaskFormAction } from "@/features/subtasks/components/forms/new-subtask/new-subtask-form-action";

type Props = {
  taskId: string;
};

export function useNewSubtaskFormConfig({
  taskId,
}: Props): FormConfig<NewSubtaskFormState, NewSubtaskFormInput> {
  const router = useRouter();
  const defaultValues: DeepPartial<NewSubtaskFormInput> = {
    featureName: "",
    product: "",
    role: "",
    subtaskType: "",
    taskId,
  };

  const fields: FormFieldsType<NewSubtaskFormInput> = {
    featureName: {
      type: "input",
      label: "Feature Name",
      placeholder: "Enter feature name",
    },
    product: {
      type: "select",
      label: "Product",
      placeholder: "Enter product",
      options: [
        { label: "Hoa Loan", value: "hoa-loan" },
        { label: "Hoa Account", value: "hoa-account" },
      ],
    },
    role: {
      type: "select",
      label: "Role",
      placeholder: "Enter role",
      options: [
        { label: "PM (Property Manager)", value: "pm" },
        { label: "FSP (Financial Service Provider)", value: "fsp" },
      ],
    },
    subtaskType: {
      type: "select",
      label: "Subtask Type",
      placeholder: "Select subtask type",
      options: [
        { label: "Generic", value: SubtaskType.GENERIC },
        { label: "Request", value: SubtaskType.REQUEST },
      ],
    },
    taskId: {
      type: "hidden",
    },
  };

  return {
    fields,
    defaultValues,
    schema: newSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: newSubtaskFormAction,
    useErrorAction: () => {
      return (state: NewSubtaskFormState) => {
        toast.error(state?.error || "Something went wrong. Please try again.");
      };
    },
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
          <Button type="submit" disabled={isPending}>
            Create Subtask
          </Button>
        </div>
      );
    },
  };
}
