import { db } from "@/lib/db";
import type { CreateProjectInput, UpdateProjectInput } from "@/lib/validations/project-schema";

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
    return db.project.findUnique({
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
          },
        },
      },
    });
  }

  /**
   * Create a new project
   */
  static async createProject(data: CreateProjectInput) {
    return db.project.create({
      data,
    });
  }

  /**
   * Update an existing project
   */
  static async updateProject(id: string, data: UpdateProjectInput) {
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
