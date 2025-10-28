import { PageHeader } from "@/components/ui/page-header";
import { PageContent } from "@/components/ui/page-content";
import { CreateInquiryProcessSubtaskForm } from "@/features/subtasks/forms/inquiry-process-subtask/create-inquiry-process-subtask-form";

type Props = {
  params: Promise<{
    taskId: string;
  }>;
};

export default async function InquiryProcessSubtaskPage({ params }: Props) {
  const { taskId } = await params;

  return (
    <>
      <PageHeader>
        <PageHeader.Title
          title="Inquiry Process Subtask"
          subtitle="This task will define the inquiry process for the given feature"
          backLabel="Back to Type Selection"
        />
      </PageHeader>

      <PageContent>
        <CreateInquiryProcessSubtaskForm taskId={taskId} />
      </PageContent>
    </>
  );
}
