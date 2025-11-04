import { notFound } from "next/navigation";
import { TypedLink, routes } from "@/lib/routes";
import { SubtaskService } from "@/lib/services/subtask-service";
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
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { getTypeConfig } from "@/features/subtasks/config/type-config";
import { SubtaskType } from "@prisma/client";
import { UpdateRequestSubtaskForm } from "@/features/subtasks/forms/request-subtask/update/update-request-subtask-form";
import { ProjectService } from "@/lib/services/project-service";
import {
  SwaggerEndpoint,
  SwaggerService,
} from "@/lib/services/swagger-service";

interface EditSubtaskPageProps {
  params: Promise<{
    projectId: string;
    taskId: string;
    subtaskId: string;
  }>;
}

export default async function EditSubtaskPage({
  params,
}: EditSubtaskPageProps) {
  const { projectId, taskId, subtaskId } = await params;
  const project = await ProjectService.getProjectById(projectId);
  let endpoints: SwaggerEndpoint[] = [];

  if (project.githubRepo && project.swaggerPath) {
    endpoints = await SwaggerService.getEndpointsFromGitHub(
      project.githubRepo!,
      project.swaggerPath!,
    );
  }

  const subtask = await SubtaskService.getSubtaskById(subtaskId);

  if (
    !subtask ||
    subtask.taskId !== taskId ||
    subtask.task.projectId !== projectId
  ) {
    notFound();
  }

  const typeConfig = getTypeConfig(subtask.type);

  const renderContent = () => {
    switch (subtask.type) {
      case SubtaskType.REQUEST:
        return (
          <UpdateRequestSubtaskForm subtask={subtask} endpoints={endpoints} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TypedLink
        route={routes.projects.tasks.detail}
        params={{ projectId, taskId }}
        data-transition-ignore
      >
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {subtask.task.name}
        </Button>
      </TypedLink>

      <PageHeader>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gradient">Edit Subtask</h1>
            <Badge variant={typeConfig.badgeVariant}>
              {typeConfig.icon} {typeConfig.label}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Update subtask in {subtask.task.name}
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Note: Subtask type cannot be changed after creation
          </p>
        </div>
      </PageHeader>

      <PageContent>
        <Card>
          <CardHeader>
            <CardTitle>Subtask Details</CardTitle>
            <CardDescription>
              Update the subtask name and content (supports Markdown)
            </CardDescription>
          </CardHeader>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </PageContent>
    </>
  );
}
