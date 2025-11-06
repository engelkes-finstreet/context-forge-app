import { PageContent } from "@/components/ui/page-content";
import { PageHeader } from "@/components/ui/page-header";
import { CreateInteractiveListSubtaskForm } from "@/features/subtasks/forms/interactive-list-subtask/create/create-interactive-list-subtask-form";

type Props = {
  params: Promise<{
    taskId: string;
  }>;
};

export default async function PresentationListSubtaskPage({ params }: Props) {
  const { taskId } = await params;

  return (
    <>
      <PageHeader>
        <PageHeader.Title
          title="Presentation List Subtask"
          subtitle="This task will define the presentation list for the given feature"
          backLabel="Back to Type Selection"
        />
      </PageHeader>

      <PageContent>
        <CreateInteractiveListSubtaskForm taskId={taskId} />
      </PageContent>
    </>
  );
}
