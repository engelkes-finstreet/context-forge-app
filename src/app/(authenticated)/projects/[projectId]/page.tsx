import { notFound } from 'next/navigation';
import { TypedLink, routes } from '@/lib/routes';
import { ProjectService } from '@/lib/services/project-service';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { PageContent } from '@/components/ui/page-content';
import { StaggeredContainer, StaggeredItem } from '@/components/ui/staggered-container';
import { PlusCircle, ArrowLeft, Pencil } from 'lucide-react';

interface ProjectDetailPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;
  const project = await ProjectService.getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <>
      <TypedLink route={routes.projects.list} params={{}} data-transition-ignore>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </TypedLink>

      <PageHeader>
        <PageHeader.Title
          title={project.name}
          subtitle={project.description || undefined}
        />
        <PageHeader.Actions>
          <div className="flex gap-2">
            <TypedLink route={routes.projects.edit} params={{ projectId }}>
              <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Project
              </Button>
            </TypedLink>
            <TypedLink route={routes.projects.tasks.new} params={{ projectId }}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </TypedLink>
          </div>
        </PageHeader.Actions>
      </PageHeader>

      <PageContent>
        <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
        {project.tasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground mb-4">No tasks yet</p>
              <TypedLink route={routes.projects.tasks.new} params={{ projectId }}>
                <Button>Create Your First Task</Button>
              </TypedLink>
            </CardContent>
          </Card>
        ) : (
          <StaggeredContainer className="grid gap-4">
            {project.tasks.map((task) => (
              <StaggeredItem key={task.id}>
                <TypedLink route={routes.projects.tasks.detail} params={{ projectId, taskId: task.id }}>
                  <Card interactive={true}>
                    <CardHeader>
                      <CardTitle>{task.name}</CardTitle>
                      <CardDescription>
                        {task._count.subtasks}{' '}
                        {task._count.subtasks === 1 ? 'subtask' : 'subtasks'}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </TypedLink>
              </StaggeredItem>
            ))}
          </StaggeredContainer>
        )}
      </PageContent>
    </>
  );
}
