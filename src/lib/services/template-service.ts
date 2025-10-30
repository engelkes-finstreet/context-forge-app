import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { Result, toResult } from "@/lib/result";
import {
  CreateTemplateInput,
  SubtaskTemplateInput,
} from "@/features/templates/components/forms/create-template/create-template-form-schema";

export class TemplateService {
  /**
   * Get all templates with subtask template counts
   */
  static async getAll() {
    return db.taskTemplate.findMany({
      include: {
        _count: {
          select: {
            subtaskTemplates: true,
            tasks: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  /**
   * Get a single template by ID with all subtask templates
   * Note: This method throws notFound() for Next.js page rendering
   */
  static async getById(id: string) {
    const template = await db.taskTemplate.findUnique({
      where: { id },
      include: {
        subtaskTemplates: {
          orderBy: {
            order: "asc",
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    if (!template) {
      notFound();
    }

    return template;
  }

  /**
   * Create a new template with subtask templates
   * Returns Result type for use in server actions
   */
  static async create(
    data: CreateTemplateInput
  ): Promise<
    Result<Prisma.TaskTemplateGetPayload<{ include: { subtaskTemplates: true } }>>
  > {
    return toResult(async () => {
      return db.taskTemplate.create({
        data: {
          name: data.name,
          description: data.description,
          subtaskTemplates: {
            create: data.subtaskTemplates.map((st) => ({
              name: st.name,
              type: st.type,
              content: st.content,
              metadata: st.metadata,
              order: st.order,
              required: st.required,
            })),
          },
        },
        include: {
          subtaskTemplates: true,
        },
      });
    });
  }

  /**
   * Update an existing template
   * Returns Result type for use in server actions
   */
  static async update(
    id: string,
    data: CreateTemplateInput
  ): Promise<
    Result<Prisma.TaskTemplateGetPayload<{ include: { subtaskTemplates: true } }>>
  > {
    return toResult(async () => {
      return db.$transaction(async (tx) => {
        // Delete existing subtask templates
        await tx.subtaskTemplate.deleteMany({
          where: { templateId: id },
        });

        // Update template and create new subtask templates
        return tx.taskTemplate.update({
          where: { id },
          data: {
            name: data.name,
            description: data.description,
            subtaskTemplates: {
              create: data.subtaskTemplates.map((st) => ({
                name: st.name,
                type: st.type,
                content: st.content,
                metadata: st.metadata,
                order: st.order,
                required: st.required,
              })),
            },
          },
          include: {
            subtaskTemplates: true,
          },
        });
      });
    });
  }

  /**
   * Delete a template and all its subtask templates (cascade)
   * Returns Result type for use in server actions
   */
  static async delete(
    id: string
  ): Promise<Result<Prisma.TaskTemplateGetPayload<object>>> {
    return toResult(() => db.taskTemplate.delete({ where: { id } }));
  }

  /**
   * Apply template to a task - creates all subtasks from template
   * Returns Result type for use in server actions
   */
  static async applyTemplate(
    templateId: string,
    taskId: string
  ): Promise<Result<Prisma.SubtaskGetPayload<object>[]>> {
    return toResult(async () => {
      const template = await db.taskTemplate.findUnique({
        where: { id: templateId },
        include: {
          subtaskTemplates: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });

      if (!template) {
        throw new Error("Template not found");
      }

      return db.$transaction(async (tx) => {
        const subtasks = [];

        for (const subtemplate of template.subtaskTemplates) {
          const subtask = await tx.subtask.create({
            data: {
              taskId,
              name: subtemplate.name,
              type: subtemplate.type,
              content: subtemplate.content,
              metadata: subtemplate.metadata as Prisma.InputJsonValue,
              order: subtemplate.order,
            },
          });
          subtasks.push(subtask);
        }

        // Increment usage count
        await tx.taskTemplate.update({
          where: { id: templateId },
          data: { usageCount: { increment: 1 } },
        });

        return subtasks;
      });
    });
  }

  /**
   * Get template progress for a task
   * Compares task's subtasks with template's subtask templates
   */
  static async getTemplateProgress(taskId: string): Promise<{
    total: number;
    completed: number;
    templateSubtasks: Array<{
      name: string;
      required: boolean;
      matched: boolean;
      subtaskId?: string;
    }>;
  } | null> {
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: {
        template: {
          include: {
            subtaskTemplates: {
              orderBy: { order: "asc" },
            },
          },
        },
        subtasks: true,
      },
    });

    if (!task || !task.template) {
      return null;
    }

    const templateSubtasks = task.template.subtaskTemplates.map((st) => {
      // Try to find matching subtask by name and type
      const matchedSubtask = task.subtasks.find(
        (s) => s.name === st.name && s.type === st.type
      );

      return {
        name: st.name,
        required: st.required,
        matched: !!matchedSubtask,
        subtaskId: matchedSubtask?.id,
      };
    });

    const completed = templateSubtasks.filter((ts) => ts.matched).length;

    return {
      total: templateSubtasks.length,
      completed,
      templateSubtasks,
    };
  }

  /**
   * Check if a template exists
   */
  static async templateExists(id: string): Promise<boolean> {
    const count = await db.taskTemplate.count({
      where: { id },
    });
    return count > 0;
  }
}
