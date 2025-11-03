import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PageContent } from "@/components/ui/page-content";
import { PageHeader } from "@/components/ui/page-header";
import { UpdateRequestSubtaskForm } from "@/features/subtasks/forms/request-subtask/update/update-request-subtask-form";
import { TypedLink, routes } from "@/lib/routes";
import { ProjectService } from "@/lib/services/project-service";
import { SubtaskService } from "@/lib/services/subtask-service";
import { SwaggerService } from "@/lib/services/swagger-service";

type Props = {
  params: Promise<{
    projectId: string;
    taskId: string;
    subtaskId: string;
  }>;
};

export default async function RequestSubtaskEditPage({ params }: Props) {
  const { projectId, taskId, subtaskId } = await params;
  const project = await ProjectService.getProjectById(projectId);
  const subtask = await SubtaskService.getSubtaskById(subtaskId);

  if (project.githubRepo && project.swaggerPath) {
    const endpoints = await SwaggerService.getEndpointsFromGitHub(
      project.githubRepo!,
      project.swaggerPath!,
    );

    return (
      <>
        <PageHeader>
          <PageHeader.Title
            title="Edit Request Subtask"
            subtitle="Update the requests for the given feature"
            backLabel="Back to Type Selection"
          />
        </PageHeader>

        <PageContent>
          <UpdateRequestSubtaskForm subtask={subtask} endpoints={endpoints} />
        </PageContent>
      </>
    );
  }

  return (
    <>
      <PageHeader>
        <PageHeader.Title
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
