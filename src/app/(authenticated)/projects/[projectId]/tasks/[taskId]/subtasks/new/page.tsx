import { notFound } from "next/navigation";
import { TypedLink, routes } from "@/lib/routes";
import { TaskService } from "@/lib/services/task-service";
import { Button } from "@/components/ui/button";
import { TypeSelector } from "@/features/subtasks/components/type-selector/type-selector";
import { ArrowLeft } from "lucide-react";

interface NewSubtaskPageProps {
  params: Promise<{
    projectId: string;
    taskId: string;
  }>;
}

/**
 * Type Selection Page (Step 1 of 2-step wizard)
 *
 * Allows users to select which type of subtask to create.
 * After selection, navigates to the type-specific form page.
 */
export default async function NewSubtaskPage({ params }: NewSubtaskPageProps) {
  const { projectId, taskId } = await params;
  const task = await TaskService.getTaskById(taskId);

  if (!task || task.projectId !== projectId) {
    notFound();
  }

  return (
    <>
      <div>
        <TypedLink
          route={routes.projects.tasks.detail}
          params={{ projectId, taskId }}
          data-transition-ignore
        >
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {task.name}
          </Button>
        </TypedLink>
      </div>

      <TypeSelector projectId={projectId} taskId={taskId} />
    </>
  );
}
