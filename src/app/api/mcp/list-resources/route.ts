import { NextResponse } from "next/server";
import { ProjectService } from "@/lib/services/project-service";
import { buildResourceURI } from "@/lib/mcp/utils";
import type { MCPListResourcesResponse, MCPResource } from "@/lib/mcp/types";

/**
 * MCP Endpoint: List all available resources
 * Returns projects, tasks, and subtasks as MCP resources
 */
export async function GET() {
  try {
    const projects = await ProjectService.getAllProjects();
    const resources: MCPResource[] = [];

    for (const project of projects) {
      // Load full project with tasks and subtasks
      const fullProject = await ProjectService.getProjectById(project.id);

      if (!fullProject) continue;

      // Add tasks as resources
      for (const task of fullProject.tasks) {
        resources.push({
          uri: buildResourceURI({ projectId: project.id, taskId: task.id }),
          name: `${project.name} / ${task.name}`,
          description: `Task in ${project.name} with ${task._count.subtasks} subtask(s)`,
          mimeType: "text/markdown",
        });

        // Add subtasks as resources
        for (const subtask of task.subtasks || []) {
          resources.push({
            uri: buildResourceURI({
              projectId: project.id,
              taskId: task.id,
              subtaskId: subtask.id,
            }),
            name: `${project.name} / ${task.name} / ${subtask.name}`,
            description: `Subtask in ${task.name}`,
            mimeType: "text/markdown",
          });
        }
      }
    }

    const response: MCPListResourcesResponse = {
      resources,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error listing MCP resources:", error);
    return NextResponse.json(
      {
        error: "Failed to list resources",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
