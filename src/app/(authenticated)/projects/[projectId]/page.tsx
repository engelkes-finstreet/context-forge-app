import { notFound } from "next/navigation";
import { TypedLink, routes } from "@/lib/routes";
import { ProjectService } from "@/lib/services/project-service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { PageContent } from "@/components/ui/page-content";
import {
  StaggeredContainer,
  StaggeredItem,
} from "@/components/ui/staggered-container";
import { PlusCircle, ArrowLeft, Pencil } from "lucide-react";
import { Status } from "@prisma/client";

interface ProjectDetailPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { projectId } = await params;
  const project = await ProjectService.getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <>
      <TypedLink
        route={routes.projects.list}
        params={{}}
        data-transition-ignore
      >
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
              <TypedLink
                route={routes.projects.tasks.new}
                params={{ projectId }}
              >
                <Button>Create Your First Task</Button>
              </TypedLink>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {[Status.OPEN, Status.IN_PROGRESS, Status.DONE].map((status) => {
              const tasksInStatus = project.tasks.filter(
                (task) => task.status === status
              );

              if (tasksInStatus.length === 0) return null;

              const statusLabels = {
                [Status.OPEN]: "Open",
                [Status.IN_PROGRESS]: "In Progress",
                [Status.DONE]: "Done",
              };

              return (
                <div key={status}>
                  <h3 className="text-xl font-semibold mb-3">
                    {statusLabels[status]} ({tasksInStatus.length})
                  </h3>
                  <StaggeredContainer className="grid gap-4">
                    {tasksInStatus.map((task) => (
                      <StaggeredItem key={task.id}>
                        <TypedLink
                          route={routes.projects.tasks.detail}
                          params={{ projectId, taskId: task.id }}
                        >
                          <Card interactive={true}>
                            <CardHeader>
                              <CardTitle>{task.name}</CardTitle>
                              <CardDescription>
                                {task._count.subtasks}{" "}
                                {task._count.subtasks === 1 ? "subtask" : "subtasks"}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        </TypedLink>
                      </StaggeredItem>
                    ))}
                  </StaggeredContainer>
                </div>
              );
            })}
          </div>
        )}
      </PageContent>
    </>
  );
}
