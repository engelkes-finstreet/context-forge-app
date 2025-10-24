import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class SubtaskService {
  /**
   * Get all subtasks for a task
   */
  static async getSubtasksByTaskId(taskId: string) {
    return db.subtask.findMany({
      where: { taskId },
      orderBy: {
        order: "asc",
      },
    });
  }

  /**
   * Get a single subtask by ID
   */
  static async getSubtaskById(id: string) {
    return db.subtask.findUnique({
      where: { id },
      include: {
        task: {
          select: {
            id: true,
            name: true,
            projectId: true,
            sharedContext: true,
          },
        },
      },
    });
  }

  /**
   * Create a new subtask
   */
  static async createSubtask(data: Prisma.SubtaskUncheckedCreateInput) {
    // Get the max order for subtasks in this task
    const maxOrderSubtask = await db.subtask.findFirst({
      where: { taskId: data.taskId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const order =
      data.order ?? (maxOrderSubtask ? maxOrderSubtask.order + 1 : 0);

    return db.subtask.create({
      data: {
        ...data,
        order,
      },
    });
  }

  /**
   * Update an existing subtask
   */
  static async updateSubtask(
    id: string,
    data: Prisma.SubtaskUncheckedUpdateInput,
  ) {
    return db.subtask.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a subtask
   */
  static async deleteSubtask(id: string) {
    return db.subtask.delete({
      where: { id },
    });
  }

  /**
   * Reorder subtasks within a task
   */
  static async reorderSubtasks(taskId: string, subtaskIds: string[]) {
    // Update each subtask's order based on its position in the array
    const updates = subtaskIds.map((subtaskId, index) =>
      db.subtask.update({
        where: { id: subtaskId },
        data: { order: index },
      }),
    );

    await db.$transaction(updates);
  }

  /**
   * Check if a subtask exists
   */
  static async subtaskExists(id: string): Promise<boolean> {
    const count = await db.subtask.count({
      where: { id },
    });
    return count > 0;
  }
}
