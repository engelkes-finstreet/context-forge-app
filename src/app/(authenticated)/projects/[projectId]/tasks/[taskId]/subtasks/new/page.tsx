import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TaskService } from '@/lib/services/task-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateSubtaskForm } from '@/features/subtasks/components/forms/create-subtask/create-subtask-form';
import { ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface NewSubtaskPageProps {
  params: Promise<{
    projectId: string;
    taskId: string;
  }>;
}

export default async function NewSubtaskPage({ params }: NewSubtaskPageProps) {
  const { projectId, taskId } = await params;
  const task = await TaskService.getTaskById(taskId);

  if (!task || task.projectId !== projectId) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link href={`/projects/${projectId}/tasks/${taskId}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {task.name}
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Subtask</h1>
        <p className="text-muted-foreground mt-2">
          Add a new subtask to {task.name}
        </p>
      </div>

      {task.sharedContext && (
        <Alert>
          <AlertTitle>Shared Context (Available to all subtasks)</AlertTitle>
          <AlertDescription className="prose prose-sm max-w-none mt-2">
            <pre className="whitespace-pre-wrap text-sm">
              {task.sharedContext}
            </pre>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Subtask Details</CardTitle>
          <CardDescription>
            Define the subtask name and content (supports Markdown)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateSubtaskForm taskId={taskId} />
        </CardContent>
      </Card>
    </div>
  );
}
