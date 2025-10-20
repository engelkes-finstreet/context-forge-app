import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TaskService } from '@/lib/services/task-service';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlusCircle, ArrowLeft, Pencil } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { getTypeConfig } from '@/features/subtasks/config/type-config';

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
    <div className="space-y-8">
      <div>
        <Link href={`/projects/${projectId}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {task.project.name}
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{task.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Project: {task.project.name}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/projects/${projectId}/tasks/${taskId}/edit`}>
              <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Task
              </Button>
            </Link>
            <Link href={`/projects/${projectId}/tasks/${taskId}/subtasks/new`}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Subtask
              </Button>
            </Link>
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
              <Link href={`/projects/${projectId}/tasks/${taskId}/subtasks/new`}>
                <Button>Create Your First Subtask</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {task.subtasks.map((subtask) => {
              const typeConfig = getTypeConfig(subtask.type);
              return (
                <Link
                  key={subtask.id}
                  href={`/projects/${projectId}/tasks/${taskId}/subtasks/${subtask.id}/edit`}
                >
                  <Card className="hover:border-primary transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg flex-1">{subtask.name}</CardTitle>
                        <Badge variant={typeConfig.badgeVariant} className="shrink-0">
                          {typeConfig.icon} {typeConfig.label}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {subtask.content.substring(0, 200)}
                        {subtask.content.length > 200 && '...'}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
