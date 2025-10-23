import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
}

export default async function NewRequestSubtaskPage({ params }: Props) {
    const { projectId, taskId } = await params;
    const project = await ProjectService.getProjectById(projectId);
    const task = await TaskService.getTaskById(taskId);

    const endpoints = await SwaggerService.getEndpointsFromGitHub(project.githubRepo!, project.swaggerPath!);

    if (!task || task.projectId !== projectId) {
        notFound();
    }

    const typeConfig = getTypeConfig(SubtaskType.REQUEST);  

    return (
        <>
            <TypedLink route={routes.projects.tasks.subtasks.typeSelector} params={{ projectId, taskId }} data-transition-ignore>
                <Button variant="ghost" size="sm" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Type Selection
                </Button>
            </TypedLink>

            <PageHeader>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gradient">Create Request Subtask</h1>
            <Badge variant={typeConfig.badgeVariant}>
              {typeConfig.icon} {typeConfig.label}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {typeConfig.description}
          </p>
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
          <CreateRequestSubtaskForm taskId={taskId} endpoints={endpoints} />
        </CardContent>
      </Card>
      </PageContent>
        </>
    )
}