import { notFound } from "next/navigation";
import { TypedLink, routes } from "@/lib/routes";
import { TaskService } from "@/lib/services/task-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { PageContent } from "@/components/ui/page-content";
import { PlusCircle, ArrowLeft, Pencil } from "lucide-react";
import { DraggableSubtaskList } from "@/features/subtasks/components/draggable-subtask-list";
import { Markdown } from "@/components/ui/markdown";

interface TaskDetailPageProps {
  params: Promise<{
    projectId: string;
    taskId: string;
  }>;
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { projectId, taskId } = await params;
  const task = await TaskService.getTaskById(taskId);

  if (!task || task.projectId !== projectId) {
    notFound();
  }

  return (
    <>
      <TypedLink
        route={routes.projects.detail}
        params={{ projectId }}
        data-transition-ignore
      >
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {task.project.name}
        </Button>
      </TypedLink>

      <PageHeader>
        <PageHeader.Title
          title={task.name}
          subtitle={`Project: ${task.project.name}`}
        />
        <PageHeader.Actions>
          <div className="flex gap-2">
            <TypedLink
              route={routes.projects.tasks.edit}
              params={{ projectId, taskId }}
            >
              <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Task
              </Button>
            </TypedLink>
            <TypedLink
              route={routes.projects.tasks.subtasks.typeSelector}
              params={{ projectId, taskId }}
            >
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Subtask
              </Button>
            </TypedLink>
          </div>
        </PageHeader.Actions>
      </PageHeader>

      <PageContent>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Subtasks</h2>
          {task.subtasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <p className="text-muted-foreground mb-4">No subtasks yet</p>
                <TypedLink
                  route={routes.projects.tasks.subtasks.typeSelector}
                  params={{ projectId, taskId }}
                >
                  <Button>Create Your First Subtask</Button>
                </TypedLink>
              </CardContent>
            </Card>
          ) : (
            <DraggableSubtaskList
              subtasks={task.subtasks}
              taskId={taskId}
              projectId={projectId}
            />
          )}
        </div>
        {task.sharedContext && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Shared Context</CardTitle>
            </CardHeader>
            <CardContent>
              <Markdown content={task.sharedContext} />
            </CardContent>
          </Card>
        )}
      </PageContent>
    </>
  );
}
