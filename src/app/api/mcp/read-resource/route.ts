import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "@/lib/services/task-service";
import { SubtaskService } from "@/lib/services/subtask-service";
import { parseResourceURI, generateMarkdownContent } from "@/lib/mcp/utils";
import type { MCPReadResourceResponse } from "@/lib/mcp/types";

/**
 * MCP Endpoint: Read a specific resource
 * Returns the content of a task or subtask as markdown
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uri } = body;

    if (!uri) {
      return NextResponse.json(
        { error: "Missing required parameter: uri" },
        { status: 400 },
      );
    }

    const parsed = parseResourceURI(uri);

    if (!parsed) {
      return NextResponse.json(
        { error: "Invalid resource URI format" },
        { status: 400 },
      );
    }

    let markdown = "";

    if (parsed.type === "task" && parsed.taskId) {
      const task = await TaskService.getTaskById(parsed.taskId);

      if (!task || task.projectId !== parsed.projectId) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }

      markdown = generateMarkdownContent({
        type: "task",
        name: task.name,
        sharedContext: task.sharedContext,
      });
    } else if (parsed.type === "subtask" && parsed.subtaskId) {
      const subtask = await SubtaskService.getSubtaskById(parsed.subtaskId);

      if (
        !subtask ||
        subtask.taskId !== parsed.taskId ||
        subtask.task.projectId !== parsed.projectId
      ) {
        return NextResponse.json(
          { error: "Subtask not found" },
          { status: 404 },
        );
      }

      markdown = generateMarkdownContent({
        type: "subtask",
        name: subtask.name,
        sharedContext: subtask.task.sharedContext,
        content: subtask.content,
      });
    } else {
      return NextResponse.json(
        { error: "Only task and subtask resources can be read" },
        { status: 400 },
      );
    }

    const response: MCPReadResourceResponse = {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: markdown,
        },
      ],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error reading MCP resource:", error);
    return NextResponse.json(
      {
        error: "Failed to read resource",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
