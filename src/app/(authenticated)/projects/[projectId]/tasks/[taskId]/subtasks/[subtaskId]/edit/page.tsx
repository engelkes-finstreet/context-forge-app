import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SubtaskService } from '@/lib/services/subtask-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EditSubtaskForm } from '@/features/subtasks/components/forms/edit-subtask/edit-subtask-form';
import { ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EditSubtaskPageProps {
  params: Promise<{
    projectId: string;
    taskId: string;
    subtaskId: string;
  }>;
}

export default async function EditSubtaskPage({ params }: EditSubtaskPageProps) {
  const { projectId, taskId, subtaskId } = await params;
  const subtask = await SubtaskService.getSubtaskById(subtaskId);

  if (!subtask || subtask.taskId !== taskId || subtask.task.projectId !== projectId) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link href={`/projects/${projectId}/tasks/${taskId}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {subtask.task.name}
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Subtask</h1>
        <p className="text-muted-foreground mt-2">
          Update subtask in {subtask.task.name}
        </p>
      </div>

      {subtask.task.sharedContext && (
        <Alert>
          <AlertTitle>Shared Context (Available to all subtasks)</AlertTitle>
          <AlertDescription className="prose prose-sm max-w-none mt-2">
            <pre className="whitespace-pre-wrap text-sm">
              {subtask.task.sharedContext}
            </pre>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Subtask Details</CardTitle>
          <CardDescription>
            Update the subtask name and content (supports Markdown)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditSubtaskForm
            subtaskId={subtaskId}
            taskId={taskId}
            projectId={projectId}
            defaultValues={{
              name: subtask.name,
              content: subtask.content,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
