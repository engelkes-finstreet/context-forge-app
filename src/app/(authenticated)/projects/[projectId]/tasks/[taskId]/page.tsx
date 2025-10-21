import { notFound } from 'next/navigation';
import { TypedLink, routes } from '@/lib/routes';
import { TaskService } from '@/lib/services/task-service';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { PageTransition } from '@/components/ui/page-transition';
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
    <PageTransition className="max-w-4xl mx-auto space-y-8">
      <div>
        <TypedLink route={routes.projects.detail} params={{ projectId }}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {task.project.name}
          </Button>
        </TypedLink>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">{task.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Project: {task.project.name}
            </p>
          </div>
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
        </div>
      </div>

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
    </PageTransition>
  );
}
