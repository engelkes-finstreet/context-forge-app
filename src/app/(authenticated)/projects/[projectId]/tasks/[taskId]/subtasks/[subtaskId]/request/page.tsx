import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PageContent } from "@/components/ui/page-content";
import { PageHeader } from "@/components/ui/page-header";
import { PageHeaderTitle } from "@/components/ui/page-header/page-header-title";
import { CreateRequestSubtaskForm } from "@/features/subtasks/forms/request-subtask/create-request-subtask-form";
import { TypedLink, routes } from "@/lib/routes";
import { ProjectService } from "@/lib/services/project-service";
import { SwaggerService } from "@/lib/services/swagger-service";
import { TaskService } from "@/lib/services/task-service";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    projectId: string;
    taskId: string;
    subtaskId: string;
  }>;
};

export default async function NewRequestSubtaskPage({ params }: Props) {
  const { projectId, taskId, subtaskId } = await params;
  const project = await ProjectService.getProjectById(projectId);
  const task = await TaskService.getTaskById(taskId);

  if (task.projectId !== projectId) {
    notFound();
  }

  if (project.githubRepo && project.swaggerPath) {
    const endpoints = await SwaggerService.getEndpointsFromGitHub(
      project.githubRepo!,
      project.swaggerPath!,
    );

    return (
      <>
        <PageHeader>
          <PageHeader.Title
            title="New Request Subtask"
            subtitle="This task will define which requests to make for the given feature"
            backLabel="Back to Type Selection"
          />
        </PageHeader>

        <PageContent>
          <CreateRequestSubtaskForm
            taskId={taskId}
            subtaskId={subtaskId}
            endpoints={endpoints}
          />
        </PageContent>
      </>
    );
  }

  return (
    <>
      <PageHeader>
        <PageHeaderTitle
          title="Swagger path not configured"
          subtitle="Go back to the project and add a GitHub repository and Swagger path"
        />
      </PageHeader>

      <PageContent>
        <Alert variant="destructive" className="flex justify-between">
          <div>
            <AlertTitle>Swagger path not configured</AlertTitle>
            <AlertDescription>
              Go back to the project and add a GitHub repository and Swagger
              path
            </AlertDescription>
          </div>
          <TypedLink route={routes.projects.detail} params={{ projectId }}>
            <Button variant="ghost">Back to Project</Button>
          </TypedLink>
        </Alert>
      </PageContent>
    </>
  );
}
