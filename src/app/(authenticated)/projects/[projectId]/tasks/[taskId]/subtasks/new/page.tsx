import { notFound } from "next/navigation";
import { TypedLink, routes } from "@/lib/routes";
import { TaskService } from "@/lib/services/task-service";
import { Button } from "@/components/ui/button";
import { TypeSelector } from "@/features/subtasks/components/type-selector/type-selector";
import { ArrowLeft } from "lucide-react";
import { NewSubtaskForm } from "@/features/subtasks/forms/new-subtask/new-subtask-form";
import { PageHeader } from "@/components/ui/page-header";
import { PageContent } from "@/components/ui/page-content";

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
      <PageHeader>
        <PageHeader.Title
          title="Create New Subtask"
          subtitle={`Add a new subtask to ${task.name}`}
          backLabel={`Back to ${task.name}`}
        />
      </PageHeader>

      <PageContent>
        <NewSubtaskForm taskId={taskId} />
      </PageContent>
    </>
  );
}
