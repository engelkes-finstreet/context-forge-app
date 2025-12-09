import { z } from "zod";

const contentTaskGroupSchema = z.object({
  subtaskType: z.literal("content"),
  content: z.string().min(1, "Content is required"),
});

const subtaskTaskGroupSchema = z.object({
  subtaskType: z.literal("subtask"),
  subtasks: z.array(
    z.object({
      actionLabel: z.string().min(1, "Action Label is required"),
      name: z.string().min(1, "Name is required"),
    }),
  ),
});

const subtaskChildrenSchema = z.discriminatedUnion("subtaskType", [
  contentTaskGroupSchema,
  subtaskTaskGroupSchema,
]);

const taskGroupMetadataSchema = z.array(
  z.object({
    taskGroupName: z.string().min(1, "Task Group name is required"),
    taskPanels: z.array(
      z.object({
        taskPanelName: z.string().min(1, "Task Panel name is required"),
        title: z.string().min(1, "Title is required"),
        children: subtaskChildrenSchema,
      }),
    ),
  }),
);

const createTaskGroupSubtaskFormSchema = z.object({
  taskId: z.string(),
  subtaskName: z.string().min(1, "Task Group name is required"),
  metadata: taskGroupMetadataSchema,
});

export type TaskGroupMetadataSchema = z.infer<typeof taskGroupMetadataSchema>;

export const updateTaskGroupSubtaskFormSchema =
  createTaskGroupSubtaskFormSchema.safeExtend({
    subtaskId: z.cuid(),
  });

export type CreateTaskGroupSubtaskFormInput = z.infer<
  typeof createTaskGroupSubtaskFormSchema
>;
export type UpdateTaskGroupSubtaskFormInput = z.infer<
  typeof updateTaskGroupSubtaskFormSchema
>;
