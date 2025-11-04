import { notFound } from "next/navigation";
import { TypedLink, routes } from "@/lib/routes";
import { SubtaskService } from "@/lib/services/subtask-service";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { PageContent } from "@/components/ui/page-content";
import { ArrowLeft, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTypeConfig } from "@/features/subtasks/config/type-config";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  GenericSubtaskDisplay,
  FormSubtaskDisplay,
  InquiryProcessSubtaskDisplay,
  ModalSubtaskDisplay,
  RequestSubtaskDisplay,
  PresentationListSubtaskDisplay,
} from "@/features/subtasks/components/display";
import {
  isFormMetadata,
  isInquiryProcessMetadata,
  isModalMetadata,
  type FormMetadata,
  type InquiryProcessMetadata,
  type ModalMetadata,
} from "@/features/subtasks/types/subtask-types";
import { SubtaskType } from "@prisma/client";

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

  // Parse metadata safely
  let parsedMetadata = null;
  try {
    if (subtask.metadata) {
      parsedMetadata =
        typeof subtask.metadata === "string"
          ? JSON.parse(subtask.metadata)
          : subtask.metadata;
    }
  } catch (error) {
    console.error("Failed to parse subtask metadata:", error);
  }

  console.log({ parsedMetadata });
  // Render the appropriate display component based on type
  const renderContent = () => {
    switch (subtask.type) {
      case SubtaskType.GENERIC:
        return <GenericSubtaskDisplay content={subtask.content} />;

      case SubtaskType.FORM:
        return (
          <FormSubtaskDisplay
            content={subtask.content}
            metadata={parsedMetadata as FormMetadata}
          />
        );

      case SubtaskType.INQUIRY_PROCESS:
        return (
          <InquiryProcessSubtaskDisplay
            content={subtask.content}
            metadata={parsedMetadata as InquiryProcessMetadata}
          />
        );

      case SubtaskType.MODAL:
        return (
          <ModalSubtaskDisplay
            content={subtask.content}
            metadata={parsedMetadata as ModalMetadata}
          />
        );

      case SubtaskType.REQUEST:
        return (
          <RequestSubtaskDisplay
            content={subtask.content}
            metadata={parsedMetadata as any}
          />
        );

      case SubtaskType.PRESENTATION_LIST:
        return (
          <PresentationListSubtaskDisplay
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
            <Badge variant={typeConfig.badgeVariant}>
              {typeConfig.icon} {typeConfig.label}
            </Badge>
          </div>
          <p className="text-muted-foreground">Task: {subtask.task.name}</p>
        </div>
        <PageHeader.Actions>
          <TypedLink
            route={routes.projects.tasks.subtasks.edit}
            params={{ projectId, taskId, subtaskId }}
          >
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Subtask
            </Button>
          </TypedLink>
        </PageHeader.Actions>
      </PageHeader>

      <PageContent>
        {subtask.task.sharedContext && (
          <Alert className="mb-6">
            <AlertTitle>Shared Context (Available to all subtasks)</AlertTitle>
            <AlertDescription className="prose prose-sm max-w-none mt-2">
              <pre className="whitespace-pre-wrap text-sm">
                {subtask.task.sharedContext}
              </pre>
            </AlertDescription>
          </Alert>
        )}

        {renderContent()}
      </PageContent>
    </>
  );
}
