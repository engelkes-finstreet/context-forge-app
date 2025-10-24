import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

export class ProjectService {
  /**
   * Get all projects with their task counts
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
   */
  static async createProject(data: Prisma.ProjectCreateInput) {
    return db.project.create({
      data,
    });
  }

  /**
   * Update an existing project
   */
  static async updateProject(id: string, data: Prisma.ProjectUpdateInput) {
    return db.project.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a project and all its tasks/subtasks (cascade)
   */
  static async deleteProject(id: string) {
    return db.project.delete({
      where: { id },
    });
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
