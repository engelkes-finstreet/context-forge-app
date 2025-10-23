import { notFound } from 'next/navigation';
import { TypedLink, routes } from '@/lib/routes';
import { TaskService } from '@/lib/services/task-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { PageContent } from '@/components/ui/page-content';
import { EditTaskForm } from '@/features/tasks/components/forms/edit-task/edit-task-form';
import { ArrowLeft } from 'lucide-react';

interface EditTaskPageProps {
  params: Promise<{
    projectId: string;
    taskId: string;
  }>;
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { projectId, taskId } = await params;
  const task = await TaskService.getTaskById(taskId);

  if (!task || task.projectId !== projectId) {
    notFound();
  }

  return (
    <>
      <TypedLink route={routes.projects.tasks.detail} params={{ projectId, taskId }} data-transition-ignore>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {task.name}
        </Button>
      </TypedLink>

      <PageHeader>
        <PageHeader.Title
          title="Edit Task"
          subtitle={`Update task in ${task.project.name}`}
        />
      </PageHeader>

      <PageContent>
        <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>
            Update the task name and shared context (supports Markdown)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditTaskForm
            taskId={taskId}
            projectId={projectId}
            defaultValues={{
              name: task.name,
              sharedContext: task.sharedContext,
            }}
          />
        </CardContent>
      </Card>
      </PageContent>
    </>
  );
}
