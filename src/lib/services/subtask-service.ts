import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { Result, toResult } from "@/lib/result";
import { notFound } from "next/navigation";

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
    const subtask = await db.subtask.findUnique({
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

    if (!subtask) {
      notFound();
    }

    return subtask;
  }

  /**
   * Create a new subtask
   * Returns Result type for use in server actions
   */
  static async createSubtask(
    data: Prisma.SubtaskUncheckedCreateInput,
  ): Promise<Result<Prisma.SubtaskGetPayload<object>>> {
    return toResult(async () => {
      // Get the max order for subtasks in this task
      const maxOrderSubtask = await db.subtask.findFirst({
        where: { taskId: data.taskId },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const order =
        data.order ?? (maxOrderSubtask ? maxOrderSubtask.order + 1 : 0);

      // Create subtask and set parent task status to OPEN in a transaction
      const [subtask] = await db.$transaction([
        db.subtask.create({
          data: {
            ...data,
            order,
          },
        }),
        db.task.update({
          where: { id: data.taskId },
          data: { status: "OPEN" },
        }),
      ]);

      return subtask;
    });
  }

  /**
   * Update an existing subtask
   * Returns Result type for use in server actions
   */
  static async updateSubtask(
    id: string,
    data: Prisma.SubtaskUncheckedUpdateInput,
  ): Promise<Result<Prisma.SubtaskGetPayload<object>>> {
    return toResult(() => db.subtask.update({ where: { id }, data }));
  }

  /**
   * Delete a subtask
   * Returns Result type for use in server actions
   */
  static async deleteSubtask(
    id: string,
  ): Promise<Result<Prisma.SubtaskGetPayload<object>>> {
    return toResult(() => db.subtask.delete({ where: { id } }));
  }

  /**
   * Reorder subtasks within a task
   * Returns Result type for use in server actions
   */
  static async reorderSubtasks(
    taskId: string,
    subtaskIds: string[],
  ): Promise<Result<void>> {
    return toResult(async () => {
      // Update each subtask's order based on its position in the array
      const updates = subtaskIds.map((subtaskId, index) =>
        db.subtask.update({
          where: { id: subtaskId },
          data: { order: index },
        }),
      );

      await db.$transaction(updates);
    });
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

  /**
   * Get names of all INTERACTIVE_LIST subtasks for a task
   * Returns array of objects with label and value properties
   */
  static async getInteractiveListNames(taskId: string) {
    const subtasks = await db.subtask.findMany({
      where: {
        taskId,
        type: "INTERACTIVE_LIST",
      },
      select: {
        name: true,
      },
    });

    return subtasks.map((subtask) => ({
      label: subtask.name,
      value: subtask.name,
    }));
  }

  /**
   * Get all unique request paths from REQUEST subtasks for a task
   * Extracts paths from the metadata.requests[].endpoint field
   * Returns array of objects with label and value properties
   */
  static async getRequestPaths(taskId: string) {
    const subtasks = await db.subtask.findMany({
      where: {
        taskId,
        type: "REQUEST",
      },
      select: {
        metadata: true,
      },
    });

    // Extract all unique paths from request metadata
    const paths = new Set<string>();
    for (const subtask of subtasks) {
      if (subtask.metadata) {
        const metadata = subtask.metadata as {
          requests?: Array<{ endpoint?: string }>;
        };
        if (metadata.requests && Array.isArray(metadata.requests)) {
          for (const request of metadata.requests) {
            if (request.endpoint) {
              paths.add(request.endpoint);
            }
          }
        }
      }
    }

    return Array.from(paths).map((path) => ({
      label: path,
      value: path,
    }));
  }
}
