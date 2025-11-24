import { notFound } from "next/navigation";
import { TypedLink, routes } from "@/lib/routes";
import { SubtaskService } from "@/lib/services/subtask-service";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { PageContent } from "@/components/ui/page-content";
import {
  ArrowLeft,
  Pencil,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  FileText,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTypeConfig } from "@/features/subtasks/config/type-config";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Status } from "@prisma/client";
import {
  GenericSubtaskDisplay,
  FormSubtaskDisplay,
  InquiryProcessSubtaskDisplay,
  ModalSubtaskDisplay,
  RequestSubtaskDisplay,
  PresentationListSubtaskDisplay,
  ListActionsSubtaskDisplay,
  SimpleFormSubtaskDisplay,
  PageSubtaskDisplay,
} from "@/features/subtasks/components/display";
import { SubtaskType } from "@prisma/client";
import { DeleteSubtaskButton } from "@/features/subtasks/components/delete-subtask-button";
import { Markdown } from "@/components/ui/markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Get status configuration for badge display
 */
function getStatusConfig(status: Status) {
  switch (status) {
    case Status.OPEN:
      return {
        label: "Open",
        variant: "outline" as const,
        icon: <Circle className="h-3 w-3" />,
      };
    case Status.IN_PROGRESS:
      return {
        label: "In Progress",
        variant: "default" as const,
        icon: <Clock className="h-3 w-3" />,
      };
    case Status.DONE:
      return {
        label: "Done",
        variant: "secondary" as const,
        icon: <CheckCircle2 className="h-3 w-3" />,
      };
  }
}

interface SubtaskDetailPageProps {
  params: Promise<{
    projectId: string;
    taskId: string;
    subtaskId: string;
  }>;
}

/**
 * Subtask Detail Page
 *
 * Dynamically renders the appropriate display component based on subtask type.
 * Includes type-safe metadata handling and shared context display.
 */
export default async function SubtaskDetailPage({
  params,
}: SubtaskDetailPageProps) {
  const { projectId, taskId, subtaskId } = await params;
  const subtask = await SubtaskService.getSubtaskById(subtaskId);

  if (
    !subtask ||
    subtask.taskId !== taskId ||
    subtask.task.projectId !== projectId
  ) {
    notFound();
  }

  const typeConfig = getTypeConfig(subtask.type);
  const statusConfig = getStatusConfig(subtask.status);
  const isDone = subtask.status === Status.DONE;
  const isNotEditable =
    subtask.status === Status.DONE || subtask.status === Status.IN_PROGRESS;

  // Metadata is already a JavaScript object (no parsing needed)
  const parsedMetadata = subtask.metadata;
  // Render the appropriate display component based on type
  const renderContent = () => {
    switch (subtask.type) {
      case SubtaskType.GENERIC:
        return <GenericSubtaskDisplay content={subtask.content} />;

      case SubtaskType.FORM:
        return (
          <FormSubtaskDisplay
            content={subtask.content}
            metadata={parsedMetadata as any}
          />
        );

      case SubtaskType.INQUIRY_PROCESS:
        return (
          <InquiryProcessSubtaskDisplay
            content={subtask.content}
            metadata={parsedMetadata as any}
          />
        );

      case SubtaskType.MODAL:
        return (
          <ModalSubtaskDisplay
            content={subtask.content}
            metadata={parsedMetadata as any}
          />
        );

      case SubtaskType.REQUEST:
        return (
          <RequestSubtaskDisplay
            content={subtask.content}
            metadata={parsedMetadata as any}
          />
        );

      case SubtaskType.INTERACTIVE_LIST:
        return (
          <PresentationListSubtaskDisplay
            content={subtask.content}
            metadata={parsedMetadata as any}
          />
        );

      case SubtaskType.LIST_ACTIONS_AND_PAGINATION:
        return (
          <ListActionsSubtaskDisplay
            content={subtask.content}
            metadata={parsedMetadata as any}
          />
        );

      case SubtaskType.SIMPLE_FORM:
        return (
          <SimpleFormSubtaskDisplay
            content={subtask.content}
            metadata={parsedMetadata as any}
          />
        );

      case SubtaskType.PAGE:
        return (
          <PageSubtaskDisplay
            content={subtask.content}
            metadata={parsedMetadata as any}
          />
        );

      default:
        return <GenericSubtaskDisplay content={subtask.content} />;
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
            <h1 className="text-3xl font-bold text-gradient">{subtask.name}</h1>
            <Badge
              variant={statusConfig.variant}
              className="flex items-center gap-1"
            >
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
            <Badge variant={typeConfig.badgeVariant}>
              {typeConfig.icon} {typeConfig.label}
            </Badge>
          </div>
          <p className="text-muted-foreground">Task: {subtask.task.name}</p>
        </div>
        <PageHeader.Actions>
          <div className={isNotEditable ? "cursor-not-allowed" : ""}>
            <TypedLink
              route={routes.projects.tasks.subtasks.edit}
              params={{ projectId, taskId, subtaskId }}
              style={{ pointerEvents: isNotEditable ? "none" : "auto" }}
            >
              <Button variant="outline" disabled={isNotEditable}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Subtask
              </Button>
            </TypedLink>
          </div>
          <DeleteSubtaskButton
            subtaskId={subtaskId}
            projectId={projectId}
            taskId={taskId}
            disabled={isNotEditable}
          />
        </PageHeader.Actions>
      </PageHeader>

      <PageContent>
        {isNotEditable && (
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>
              {isDone ? "Subtask Completed" : "Subtask In Progress"}
            </AlertTitle>
            <AlertDescription>
              This subtask is currently {isDone ? "completed" : "in progress"}{" "}
              and cannot be edited or deleted. To make changes, update the
              status to &quot;Open&quot; first.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">
              <FileText className="mr-2 h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="context">
              <Layers className="mr-2 h-4 w-4" />
              Task Context
              <Badge variant="outline" className="ml-2 text-xs">
                Shared
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            {renderContent()}
          </TabsContent>

          <TabsContent value="context" className="mt-6">
            {subtask.task.sharedContext ? (
              <Alert>
                <AlertTitle>
                  Shared Context (Available to all subtasks)
                </AlertTitle>
                <AlertDescription>
                  <Markdown content={subtask.task.sharedContext} />
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <AlertTitle>No Shared Context</AlertTitle>
                <AlertDescription>
                  This task does not have any shared context yet. Shared context
                  is information that is available to all subtasks within this
                  task.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </PageContent>
    </>
  );
}
