import { notFound } from "next/navigation";
import { TaskService } from "@/lib/services/task-service";
import { TypeSelectorWrapper } from "@/features/subtasks/components/type-selector/type-selector-wrapper";
import { PageHeader } from "@/components/ui/page-header";
import { PageContent } from "@/components/ui/page-content";
import { ProjectService } from "@/lib/services/project-service";
import { SwaggerService } from "@/lib/services/swagger-service";
import { SwaggerEndpointsProvider } from "@/features/subtasks/providers/swagger-endpoints-provider";
import { SubtaskService } from "@/lib/services/subtask-service";

interface NewSubtaskPageProps {
  params: Promise<{
    projectId: string;
    taskId: string;
  }>;
}

/**
 * Type Selection Page (Step 1 of 2-step wizard)
 *
 * Allows users to select which type of subtask to create.
 * After selection, displays the type-specific form.
 */
export default async function NewSubtaskPage({ params }: NewSubtaskPageProps) {
  const { projectId, taskId } = await params;
  const project = await ProjectService.getProjectById(projectId);
  const endpoints = await SwaggerService.getEndpointsFromGitHub(
    project.beGithubRepo!,
    project.swaggerPath!,
  );
  const [nameOptions, swaggerPathOptions] = await Promise.all([
    SubtaskService.getInteractiveListNames(taskId),
    SubtaskService.getRequestPaths(taskId),
  ]);
  const task = await TaskService.getTaskById(taskId);

  if (!task || task.projectId !== projectId) {
    notFound();
  }

  return (
    <>
      <PageHeader>
        <PageHeader.Title
          title="Create New Subtask"
          subtitle={`Add a new subtask to ${task.name}`}
          backLabel={`Back to ${task.name}`}
        />
      </PageHeader>

      <SwaggerEndpointsProvider endpoints={endpoints}>
        <PageContent>
          <TypeSelectorWrapper
            taskId={taskId}
            endpoints={endpoints}
            swaggerPathOptions={swaggerPathOptions}
            nameOptions={nameOptions}
          />
        </PageContent>
      </SwaggerEndpointsProvider>
    </>
  );
}
