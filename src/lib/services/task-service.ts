import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { Result, toResult } from "@/lib/result";

export class TaskService {
  /**
   * Get all tasks for a project
   * Note: This method still throws for consistency with Next.js data fetching patterns
   */
  static async getTasksByProjectId(projectId: string) {
    return db.task.findMany({
      where: { projectId },
      include: {
        _count: {
          select: {
            subtasks: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });
  }

  /**
   * Get a single task by ID with all subtasks
   * Note: This method still throws notFound() for Next.js page rendering
   */
  static async getTaskById(id: string) {
    const task = await db.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        subtasks: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!task) {
      notFound();
    }

    return task;
  }

  /**
   * Create a new task
   * Returns Result type for use in server actions
   */
  static async createTask(
    data: Prisma.TaskUncheckedCreateInput,
  ): Promise<Result<Prisma.TaskGetPayload<object>>> {
    return toResult(async () => {
      // Get the max order for tasks in this project
      const maxOrderTask = await db.task.findFirst({
        where: { projectId: data.projectId },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const order = data.order ?? (maxOrderTask ? maxOrderTask.order + 1 : 0);

      return db.task.create({
        data: {
          ...data,
          order,
        },
      });
    });
  }

  /**
   * Update an existing task
   * Returns Result type for use in server actions
   */
  static async updateTask(
    id: string,
    data: Prisma.TaskUncheckedUpdateInput,
  ): Promise<Result<Prisma.TaskGetPayload<object>>> {
    return toResult(() => db.task.update({ where: { id }, data }));
  }

  /**
   * Delete a task and all its subtasks (cascade)
   * Returns Result type for use in server actions
   */
  static async deleteTask(
    id: string,
  ): Promise<Result<Prisma.TaskGetPayload<object>>> {
    return toResult(() => db.task.delete({ where: { id } }));
  }

  /**
   * Reorder tasks within a project
   * Returns Result type for use in server actions
   */
  static async reorderTasks(
    projectId: string,
    taskIds: string[],
  ): Promise<Result<void>> {
    return toResult(async () => {
      // Update each task's order based on its position in the array
      const updates = taskIds.map((taskId, index) =>
        db.task.update({
          where: { id: taskId },
          data: { order: index },
        }),
      );

      await db.$transaction(updates);
    });
  }

  /**
   * Check if a task exists
   */
  static async taskExists(id: string): Promise<boolean> {
    const count = await db.task.count({
      where: { id },
    });
    return count > 0;
  }
}
