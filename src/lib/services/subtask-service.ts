import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { Result, success, failure, getErrorMessage } from "@/lib/result";

export class SubtaskService {
  /**
   * Get all subtasks for a task
   * Note: This method still throws for consistency with Next.js data fetching patterns
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
   * Note: This method still throws for consistency with Next.js data fetching patterns
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
   * Returns Result type for use in server actions
   */
  static async createSubtask(
    data: Prisma.SubtaskUncheckedCreateInput,
  ): Promise<Result<Prisma.SubtaskGetPayload<object>>> {
    try {
      // Get the max order for subtasks in this task
      const maxOrderSubtask = await db.subtask.findFirst({
        where: { taskId: data.taskId },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const order =
        data.order ?? (maxOrderSubtask ? maxOrderSubtask.order + 1 : 0);

      const subtask = await db.subtask.create({
        data: {
          ...data,
          order,
        },
      });
      return success(subtask);
    } catch (error) {
      return failure(getErrorMessage(error));
    }
  }

  /**
   * Update an existing subtask
   * Returns Result type for use in server actions
   */
  static async updateSubtask(
    id: string,
    data: Prisma.SubtaskUncheckedUpdateInput,
  ): Promise<Result<Prisma.SubtaskGetPayload<object>>> {
    try {
      const subtask = await db.subtask.update({
        where: { id },
        data,
      });
      return success(subtask);
    } catch (error) {
      return failure(getErrorMessage(error));
    }
  }

  /**
   * Delete a subtask
   * Returns Result type for use in server actions
   */
  static async deleteSubtask(
    id: string,
  ): Promise<Result<Prisma.SubtaskGetPayload<object>>> {
    try {
      const subtask = await db.subtask.delete({
        where: { id },
      });
      return success(subtask);
    } catch (error) {
      return failure(getErrorMessage(error));
    }
  }

  /**
   * Reorder subtasks within a task
   * Returns Result type for use in server actions
   */
  static async reorderSubtasks(
    taskId: string,
    subtaskIds: string[],
  ): Promise<Result<void>> {
    try {
      // Update each subtask's order based on its position in the array
      const updates = subtaskIds.map((subtaskId, index) =>
        db.subtask.update({
          where: { id: subtaskId },
          data: { order: index },
        }),
      );

      await db.$transaction(updates);
      return success(undefined);
    } catch (error) {
      return failure(getErrorMessage(error));
    }
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
