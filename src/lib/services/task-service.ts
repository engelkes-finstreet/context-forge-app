import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class TaskService {
  /**
   * Get all tasks for a project
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
   */
  static async getTaskById(id: string) {
    return db.task.findUnique({
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
  }

  /**
   * Create a new task
   */
  static async createTask(data: Prisma.TaskUncheckedCreateInput) {
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
  }

  /**
   * Update an existing task
   */
  static async updateTask(id: string, data: Prisma.TaskUncheckedUpdateInput) {
    return db.task.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a task and all its subtasks (cascade)
   */
  static async deleteTask(id: string) {
    return db.task.delete({
      where: { id },
    });
  }

  /**
   * Reorder tasks within a project
   */
  static async reorderTasks(projectId: string, taskIds: string[]) {
    // Update each task's order based on its position in the array
    const updates = taskIds.map((taskId, index) =>
      db.task.update({
        where: { id: taskId },
        data: { order: index },
      })
    );

    await db.$transaction(updates);
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
