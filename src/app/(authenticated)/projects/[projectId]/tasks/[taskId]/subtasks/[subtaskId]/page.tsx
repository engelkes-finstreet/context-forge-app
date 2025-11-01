import { notFound } from "next/navigation";
import { TypedLink, routes } from "@/lib/routes";
import { SubtaskService } from "@/lib/services/subtask-service";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { PageContent } from "@/components/ui/page-content";
import { ArrowLeft, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTypeConfig } from "@/features/subtasks/config/type-config";
import { SubtaskType } from "@prisma/client";
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

  if (!subtask || subtask.taskId !== taskId || subtask.task.projectId !== projectId) {
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

  // Render the appropriate display component based on type
  const renderContent = () => {
    switch (subtask.type) {
      case SubtaskType.GENERIC:
        return <GenericSubtaskDisplay content={subtask.content} />;

      case SubtaskType.FORM:
        if (isFormMetadata(parsedMetadata)) {
          return (
            <FormSubtaskDisplay
              content={subtask.content}
              metadata={parsedMetadata as FormMetadata}
            />
          );
        }
        return <GenericSubtaskDisplay content={subtask.content} />;

      case SubtaskType.INQUIRY_PROCESS:
        if (isInquiryProcessMetadata(parsedMetadata)) {
          return (
            <InquiryProcessSubtaskDisplay
              content={subtask.content}
              metadata={parsedMetadata as InquiryProcessMetadata}
            />
          );
        }
        return <GenericSubtaskDisplay content={subtask.content} />;

      case SubtaskType.MODAL:
        if (isModalMetadata(parsedMetadata)) {
          return (
            <ModalSubtaskDisplay
              content={subtask.content}
              metadata={parsedMetadata as ModalMetadata}
            />
          );
        }
        return <GenericSubtaskDisplay content={subtask.content} />;

      case SubtaskType.REQUEST:
        if (parsedMetadata && "requests" in parsedMetadata) {
          return (
            <RequestSubtaskDisplay
              content={subtask.content}
              metadata={parsedMetadata as any}
            />
          );
        }
        return <GenericSubtaskDisplay content={subtask.content} />;

      case SubtaskType.PRESENTATION_LIST:
        if (parsedMetadata && "columns" in parsedMetadata) {
          return (
            <PresentationListSubtaskDisplay
              content={subtask.content}
              metadata={parsedMetadata as any}
            />
          );
        }
        return <GenericSubtaskDisplay content={subtask.content} />;

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
          <p className="text-muted-foreground">
            Task: {subtask.task.name}
          </p>
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
