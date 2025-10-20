import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProjectService } from '@/lib/services/project-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateTaskForm } from '@/features/tasks/components/forms/create-task/create-task-form';
import { ArrowLeft } from 'lucide-react';

interface NewTaskPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function NewTaskPage({ params }: NewTaskPageProps) {
  const { projectId } = await params;
  const project = await ProjectService.getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Link href={`/projects/${projectId}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {project.name}
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Task</h1>
        <p className="text-muted-foreground mt-2">
          Add a new task to {project.name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>
            Define the task name and shared context that will be available to all subtasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTaskForm projectId={projectId} />
        </CardContent>
      </Card>
    </div>
  );
}
