import { NextRequest, NextResponse } from 'next/server';
import { TaskService } from '@/lib/services/task-service';
import { SubtaskService } from '@/lib/services/subtask-service';
import { parseResourceURI } from '@/lib/mcp/utils';
import type { MCPUpdateResourceResponse } from '@/lib/mcp/types';
import { revalidatePath } from 'next/cache';

/**
 * MCP Endpoint: Update a specific resource
 * Allows updating task shared context or subtask content
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uri, text } = body;

    if (!uri || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Missing required parameters: uri and text' },
        { status: 400 }
      );
    }

    const parsed = parseResourceURI(uri);

    if (!parsed) {
      return NextResponse.json(
        { error: 'Invalid resource URI format' },
        { status: 400 }
      );
    }

    if (parsed.type === 'task' && parsed.taskId && parsed.projectId) {
      // Update task shared context
      const task = await TaskService.getTaskById(parsed.taskId);

      if (!task || task.projectId !== parsed.projectId) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }

      await TaskService.updateTask(parsed.taskId, {
        sharedContext: text,
      });

      revalidatePath(`/projects/${parsed.projectId}/tasks/${parsed.taskId}`);
      revalidatePath(`/projects/${parsed.projectId}`);

      const response: MCPUpdateResourceResponse = {
        success: true,
        message: 'Task shared context updated successfully',
      };

      return NextResponse.json(response);
    } else if (parsed.type === 'subtask' && parsed.subtaskId && parsed.taskId && parsed.projectId) {
      // Update subtask content
      const subtask = await SubtaskService.getSubtaskById(parsed.subtaskId);

      if (!subtask || subtask.taskId !== parsed.taskId || subtask.task.projectId !== parsed.projectId) {
        return NextResponse.json(
          { error: 'Subtask not found' },
          { status: 404 }
        );
      }

      await SubtaskService.updateSubtask(parsed.subtaskId, {
        content: text,
      });

      revalidatePath(`/projects/${parsed.projectId}/tasks/${parsed.taskId}`);

      const response: MCPUpdateResourceResponse = {
        success: true,
        message: 'Subtask content updated successfully',
      };

      return NextResponse.json(response);
    } else {
      return NextResponse.json(
        { error: 'Only task and subtask resources can be updated' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating MCP resource:', error);
    return NextResponse.json(
      { error: 'Failed to update resource', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
