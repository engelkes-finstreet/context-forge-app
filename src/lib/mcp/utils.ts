/**
 * Utility functions for MCP resource URI handling
 */

export interface ParsedResourceURI {
  type: "project" | "task" | "subtask";
  projectId?: string;
  taskId?: string;
  subtaskId?: string;
}

/**
 * Parse a resource URI into its components
 * Format: context-forge://project/{projectId}/task/{taskId}/subtask/{subtaskId}
 */
export function parseResourceURI(uri: string): ParsedResourceURI | null {
  // Remove protocol if present
  const cleanUri = uri.replace("context-forge://", "");

  const parts = cleanUri.split("/");

  if (parts.length === 0) {
    return null;
  }

  // Parse project
  if (parts[0] === "project" && parts[1]) {
    const result: ParsedResourceURI = {
      type: "project",
      projectId: parts[1],
    };

    // Parse task if present
    if (parts[2] === "task" && parts[3]) {
      result.type = "task";
      result.taskId = parts[3];

      // Parse subtask if present
      if (parts[4] === "subtask" && parts[5]) {
        result.type = "subtask";
        result.subtaskId = parts[5];
      }
    }

    return result;
  }

  return null;
}

/**
 * Build a resource URI from components
 */
export function buildResourceURI(params: {
  projectId: string;
  taskId?: string;
  subtaskId?: string;
}): string {
  let uri = `context-forge://project/${params.projectId}`;

  if (params.taskId) {
    uri += `/task/${params.taskId}`;

    if (params.subtaskId) {
      uri += `/subtask/${params.subtaskId}`;
    }
  }

  return uri;
}

/**
 * Generate markdown content for a resource
 */
export function generateMarkdownContent(data: {
  type: "task" | "subtask";
  name: string;
  sharedContext?: string;
  content?: string;
}): string {
  let markdown = `# ${data.name}\n\n`;

  if (data.type === "task" && data.sharedContext) {
    markdown += `## Shared Context\n\n${data.sharedContext}\n\n`;
  }

  if (data.type === "subtask") {
    if (data.sharedContext) {
      markdown += `## Shared Context (from parent task)\n\n${data.sharedContext}\n\n`;
    }
    if (data.content) {
      markdown += `## Content\n\n${data.content}\n`;
    }
  }

  return markdown;
}
