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
import { PageTransition } from '@/components/ui/page-transition';
import { StaggeredContainer, StaggeredItem } from '@/components/ui/staggered-container';
import { PlusCircle, ArrowLeft } from 'lucide-react';

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
    <PageTransition>
      <div>
        <TypedLink route={routes.projects.list}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </TypedLink>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">{project.name}</h1>
            {project.description && (
              <p className="text-muted-foreground mt-2">{project.description}</p>
            )}
          </div>
          <TypedLink route={routes.projects.tasks.new} params={{ projectId }}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </TypedLink>
        </div>
      </div>

      <div>
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
                  <Card interactive>
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
      </div>
    </PageTransition>
  );
}
