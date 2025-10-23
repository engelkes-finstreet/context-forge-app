import { notFound } from 'next/navigation';
import { TypedLink, routes } from '@/lib/routes';
import { ProjectService } from '@/lib/services/project-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { PageContent } from '@/components/ui/page-content';
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
    <>
      <TypedLink route={routes.projects.detail} params={{ projectId }} data-transition-ignore>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {project.name}
        </Button>
      </TypedLink>

      <PageHeader>
        <PageHeader.Title
          title="Create New Task"
          subtitle={`Add a new task to ${project.name}`}
        />
      </PageHeader>

      <PageContent>
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
      </PageContent>
    </>
  );
}
