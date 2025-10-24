import { notFound } from "next/navigation";
import { TypedLink, routes } from "@/lib/routes";
import { TaskService } from "@/lib/services/task-service";
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
import { CreateGenericSubtaskForm } from "@/features/subtasks/components/forms/generic-subtask/create-subtask-form";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getTypeConfig } from "@/features/subtasks/config/type-config";
import { Badge } from "@/components/ui/badge";
import { SubtaskType } from "@prisma/client";
import { SwaggerService } from "@/lib/services/swagger-service";
import { ProjectService } from "@/lib/services/project-service";

interface NewGenericSubtaskPageProps {
  params: Promise<{
    projectId: string;
    taskId: string;
  }>;
}

/**
 * Generic Subtask Creation Page (Step 2 of 2-step wizard)
 *
 * Displays the form for creating a generic subtask after type selection.
 */
export default async function NewGenericSubtaskPage({
  params,
}: NewGenericSubtaskPageProps) {
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

  const typeConfig = getTypeConfig(SubtaskType.GENERIC);

  return (
    <>
      <TypedLink
        route={routes.projects.tasks.subtasks.typeSelector}
        params={{ projectId, taskId }}
        data-transition-ignore
      >
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Type Selection
        </Button>
      </TypedLink>

      <PageHeader>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gradient">
              Create Generic Subtask
            </h1>
            <Badge variant={typeConfig.badgeVariant}>
              {typeConfig.icon} {typeConfig.label}
            </Badge>
          </div>
          <p className="text-muted-foreground">{typeConfig.description}</p>
        </div>
      </PageHeader>

      <PageContent>
        {task.sharedContext && (
          <Alert>
            <AlertTitle>Shared Context (Available to all subtasks)</AlertTitle>
            <AlertDescription className="prose prose-sm max-w-none mt-2">
              <pre className="whitespace-pre-wrap text-sm">
                {task.sharedContext}
              </pre>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Subtask Details</CardTitle>
            <CardDescription>
              Define the subtask name and content (supports Markdown)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateGenericSubtaskForm taskId={taskId} endpoints={endpoints} />
          </CardContent>
        </Card>
      </PageContent>
    </>
  );
}
