import { FormFieldsType } from "@/components/forms/types";
import { CreateTaskGroupSubtaskFormInput } from "@/features/subtasks/forms/task-group-subtask/task-group-subtask-schema";

export function useCreateTaskGroupSubtaskFormFields(): FormFieldsType<CreateTaskGroupSubtaskFormInput> {
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
      type: "array",
      taskGroupName: {
        type: "input",
        label: "Task Group Name",
        placeholder: "Enter task group name",
      },
      taskPanels: {
        type: "array",
        taskPanelName: {
          type: "input",
          label: "Task Panel Name",
          placeholder: "Enter task panel name",
        },
        title: {
          type: "input",
          label: "Title",
          placeholder: "Enter title",
        },
        children: {
          content: {
            type: "textarea",
            label: "Content",
            placeholder: "Enter content",
          },
          subtaskType: {
            type: "select",
            label: "Type",
            placeholder: "Select type",
            options: [
              { label: "Content", value: "content" },
              { label: "Subtask", value: "subtask" },
            ],
          },
          subtasks: {
            type: "array",
            actionLabel: {
              type: "input",
              label: "Action Label",
              placeholder: "Enter action label",
            },
            name: {
              type: "input",
              label: "Name",
              placeholder: "Enter name",
            },
          },
        },
      },
    },
  };
}
