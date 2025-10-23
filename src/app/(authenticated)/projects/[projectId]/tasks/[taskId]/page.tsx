import { notFound } from 'next/navigation';
import { TypedLink, routes } from '@/lib/routes';
import { TaskService } from '@/lib/services/task-service';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { PageContent } from '@/components/ui/page-content';
import { PlusCircle, ArrowLeft, Pencil } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DraggableSubtaskList } from '@/features/subtasks/components/draggable-subtask-list';

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
      <TypedLink route={routes.projects.detail} params={{ projectId }} data-transition-ignore>
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
            <TypedLink route={routes.projects.tasks.edit} params={{ projectId, taskId }}>
              <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Task
              </Button>
            </TypedLink>
            <TypedLink route={routes.projects.tasks.subtasks.typeSelector} params={{ projectId, taskId }}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Subtask
              </Button>
            </TypedLink>
          </div>
        </PageHeader.Actions>
      </PageHeader>

      <PageContent>
        {task.sharedContext && (
        <Alert>
          <AlertTitle>Shared Context</AlertTitle>
          <AlertDescription className="prose prose-sm max-w-none mt-2">
            <pre className="whitespace-pre-wrap text-sm">
              {task.sharedContext}
            </pre>
          </AlertDescription>
        </Alert>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">Subtasks</h2>
        {task.subtasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground mb-4">No subtasks yet</p>
              <TypedLink route={routes.projects.tasks.subtasks.typeSelector} params={{ projectId, taskId }}>
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
      </PageContent>
    </>
  );
}
