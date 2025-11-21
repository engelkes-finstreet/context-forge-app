import { notFound } from "next/navigation";
import { TypedLink, routes } from "@/lib/routes";
import { SubtaskService } from "@/lib/services/subtask-service";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { PageContent } from "@/components/ui/page-content";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTypeConfig } from "@/features/subtasks/config/type-config";
import { SubtaskType } from "@prisma/client";
import { UpdateRequestSubtaskForm } from "@/features/subtasks/forms/request-subtask/update/update-request-subtask-form";
import { ProjectService } from "@/lib/services/project-service";
import {
  SwaggerEndpoint,
  SwaggerService,
} from "@/lib/services/swagger-service";
import { UpdateInquiryProcessSubtaskForm } from "@/features/subtasks/forms/inquiry-process-subtask/update/update-inquiry-process-subtask-form";
import { UpdateFormSubtaskForm } from "@/features/subtasks/forms/form-subtask/update/update-form-subtask-form";
import { UpdateInteractiveListSubtaskForm } from "@/features/subtasks/forms/interactive-list-subtask/update/update-interactive-list-subtask-form";
import { UpdateModalSubtaskForm } from "@/features/subtasks/forms/modal-subtask/update/update-modal-subtask-form";
import { UpdateListActionsSubtaskForm } from "@/features/subtasks/forms/list-actions-subtask/update/update-list-actions-subtask-form";

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
  const [nameOptions, swaggerPathOptions] = await Promise.all([
    SubtaskService.getInteractiveListNames(taskId),
    SubtaskService.getRequestPaths(taskId),
  ]);
  let endpoints: SwaggerEndpoint[] = [];

  if (project.beGithubRepo && project.swaggerPath) {
    endpoints = await SwaggerService.getEndpointsFromGitHub(
      project.beGithubRepo!,
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
      case SubtaskType.INQUIRY_PROCESS:
        return <UpdateInquiryProcessSubtaskForm subtask={subtask} />;
      case SubtaskType.FORM:
        return <UpdateFormSubtaskForm subtask={subtask} />;
      case SubtaskType.INTERACTIVE_LIST:
        return <UpdateInteractiveListSubtaskForm subtask={subtask} />;
      case SubtaskType.MODAL:
        return <UpdateModalSubtaskForm subtask={subtask} />;
      case SubtaskType.LIST_ACTIONS_AND_PAGINATION:
        return (
          <UpdateListActionsSubtaskForm
            subtask={subtask}
            swaggerPathOptions={swaggerPathOptions}
            nameOptions={nameOptions}
          />
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

      <PageContent>{renderContent()}</PageContent>
    </>
  );
}
