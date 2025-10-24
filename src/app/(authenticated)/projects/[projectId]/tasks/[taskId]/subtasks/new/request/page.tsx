import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { PageContent } from "@/components/ui/page-content";
import { PageHeader } from "@/components/ui/page-header";
import { CreateGenericSubtaskForm } from "@/features/subtasks/components/forms/generic-subtask/create-subtask-form";
import { CreateRequestSubtaskForm } from "@/features/subtasks/components/forms/request-subtask/create-request-subtask-form";
import { getTypeConfig } from "@/features/subtasks/config/type-config";
import { TypedLink, routes } from "@/lib/routes";
import { ProjectService } from "@/lib/services/project-service";
import { SwaggerService } from "@/lib/services/swagger-service";
import { TaskService } from "@/lib/services/task-service";
import { SubtaskType } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    projectId: string;
    taskId: string;
  }>;
};

export default async function NewRequestSubtaskPage({ params }: Props) {
  const { projectId, taskId } = await params;
  const project = await ProjectService.getProjectById(projectId);
  const task = await TaskService.getTaskById(taskId);

  const endpoints = await SwaggerService.getEndpointsFromGitHub(
    project.githubRepo!,
    project.swaggerPath!,
  );

  if (!task || task.projectId !== projectId) {
    notFound();
  }

  const typeConfig = getTypeConfig(SubtaskType.REQUEST);

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
        <CreateRequestSubtaskForm taskId={taskId} endpoints={endpoints} />
      </PageContent>
    </>
  );
}
