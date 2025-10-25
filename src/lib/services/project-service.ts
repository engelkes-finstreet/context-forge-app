import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { Result, success, failure, getErrorMessage } from "@/lib/result";

export class ProjectService {
  /**
   * Get all projects with their task counts
   * Note: This method still throws for consistency with Next.js data fetching patterns
   */
  static async getAllProjects() {
    return db.project.findMany({
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get a single project by ID with all tasks
   * Note: This method still throws notFound() for Next.js page rendering
   */
  static async getProjectById(id: string) {
    const project = await db.project.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: {
            order: "asc",
          },
          include: {
            _count: {
              select: {
                subtasks: true,
              },
            },
            subtasks: true,
          },
        },
      },
    });

    if (!project) {
      notFound();
    }

    return project;
  }

  /**
   * Create a new project
   * Returns Result type for use in server actions
   */
  static async createProject(
    data: Prisma.ProjectCreateInput,
  ): Promise<Result<Prisma.ProjectGetPayload<object>>> {
    try {
      const project = await db.project.create({
        data,
      });
      return success(project);
    } catch (error) {
      return failure(getErrorMessage(error));
    }
  }

  /**
   * Update an existing project
   * Returns Result type for use in server actions
   */
  static async updateProject(
    id: string,
    data: Prisma.ProjectUpdateInput,
  ): Promise<Result<Prisma.ProjectGetPayload<object>>> {
    try {
      const project = await db.project.update({
        where: { id },
        data,
      });
      return success(project);
    } catch (error) {
      return failure(getErrorMessage(error));
    }
  }

  /**
   * Delete a project and all its tasks/subtasks (cascade)
   * Returns Result type for use in server actions
   */
  static async deleteProject(
    id: string,
  ): Promise<Result<Prisma.ProjectGetPayload<object>>> {
    try {
      const project = await db.project.delete({
        where: { id },
      });
      return success(project);
    } catch (error) {
      return failure(getErrorMessage(error));
    }
  }

  /**
   * Check if a project exists
   */
  static async projectExists(id: string): Promise<boolean> {
    const count = await db.project.count({
      where: { id },
    });
    return count > 0;
  }
}
