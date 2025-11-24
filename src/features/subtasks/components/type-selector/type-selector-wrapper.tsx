"use client";

import { useEffect } from "react";
import { SubtaskType } from "@prisma/client";
import { TypeSelector } from "./type-selector";
import { CreateFormSubtaskForm } from "@/features/subtasks/forms/form-subtask/create/create-form-subtask-form";
import { CreateModalSubtaskForm } from "@/features/subtasks/forms/modal-subtask/create/create-modal-subtask-form";
import { CreateInquiryProcessSubtaskForm } from "@/features/subtasks/forms/inquiry-process-subtask/create/create-inquiry-process-subtask-form";
import { CreateInteractiveListSubtaskForm } from "@/features/subtasks/forms/interactive-list-subtask/create/create-interactive-list-subtask-form";
import { CreateRequestSubtaskForm } from "@/features/subtasks/forms/request-subtask/create/create-request-subtask-form";
import { useSelectedTypeStore } from "@/features/subtasks/stores/selected-type-store";
import { SwaggerEndpoint } from "@/lib/services/swagger-service";
import { CreateListActionsSubtaskForm } from "@/features/subtasks/forms/list-actions-subtask/create/create-list-actions-subtask-form";
import { SelectOptions } from "@/components/forms/dynamic-form-field/types";
import { CreateGenericSubtaskForm } from "@/features/subtasks/forms/generic-subtask/create-subtask-form";

interface TypeSelectorWrapperProps {
  taskId: string;
  endpoints: SwaggerEndpoint[];
  swaggerPathOptions: SelectOptions;
  nameOptions: SelectOptions;
}

/**
 * TypeSelectorWrapper Component
 *
 * Wrapper component that handles conditional rendering between
 * the type selector and the selected form component.
 * Uses Zustand store to manage the selected type state.
 */
export function TypeSelectorWrapper({
  taskId,
  endpoints,
  swaggerPathOptions,
  nameOptions,
}: TypeSelectorWrapperProps) {
  const selectedType = useSelectedTypeStore((state) => state.selectedType);
  const clearSelectedType = useSelectedTypeStore(
    (state) => state.clearSelectedType,
  );

  // Clear selected type when component unmounts
  useEffect(() => {
    return () => {
      clearSelectedType();
    };
  }, [clearSelectedType]);

  if (!selectedType) {
    return <TypeSelector />;
  }

  return (
    <CreateSubtaskForm
      taskId={taskId}
      type={selectedType}
      endpoints={endpoints}
      swaggerPathOptions={swaggerPathOptions}
      nameOptions={nameOptions}
    />
  );
}

function CreateSubtaskForm({
  taskId,
  type,
  endpoints,
  swaggerPathOptions,
  nameOptions,
}: {
  taskId: string;
  type: SubtaskType;
  endpoints: SwaggerEndpoint[];
  swaggerPathOptions: SelectOptions;
  nameOptions: SelectOptions;
}) {
  switch (type) {
    case SubtaskType.FORM:
      return <CreateFormSubtaskForm taskId={taskId} />;
    case SubtaskType.INQUIRY_PROCESS:
      return <CreateInquiryProcessSubtaskForm taskId={taskId} />;
    case SubtaskType.INTERACTIVE_LIST:
      return <CreateInteractiveListSubtaskForm taskId={taskId} />;
    case SubtaskType.REQUEST:
      return <CreateRequestSubtaskForm taskId={taskId} endpoints={endpoints} />;
    case SubtaskType.MODAL:
      return <CreateModalSubtaskForm taskId={taskId} />;
    case SubtaskType.GENERIC:
      return <CreateGenericSubtaskForm taskId={taskId} />;
    case SubtaskType.LIST_ACTIONS_AND_PAGINATION:
      return (
        <CreateListActionsSubtaskForm
          taskId={taskId}
          swaggerPathOptions={swaggerPathOptions}
          nameOptions={nameOptions}
        />
      );
    default:
      return <div>Invalid subtask type</div>;
  }
}
