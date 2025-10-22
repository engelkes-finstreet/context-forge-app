import { notFound } from 'next/navigation';
import { TypedLink, routes } from '@/lib/routes';
import { ProjectService } from '@/lib/services/project-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTransition } from '@/components/ui/page-transition';
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
    <PageTransition>
      <div>
        <TypedLink route={routes.projects.detail} params={{ projectId }}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {project.name}
          </Button>
        </TypedLink>
        <h1 className="text-3xl font-bold text-gradient">Create New Task</h1>
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
    </PageTransition>
  );
}
