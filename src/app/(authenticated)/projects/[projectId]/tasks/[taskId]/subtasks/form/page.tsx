import { PageHeader } from "@/components/ui/page-header";
import { PageContent } from "@/components/ui/page-content";
import { CreateFormSubtaskForm } from "@/features/subtasks/forms/form-subtask/create/create-form-subtask-form";

type Props = {
  params: Promise<{
    taskId: string;
  }>;
};

export default async function FormSubtaskPage({ params }: Props) {
  const { taskId } = await params;

  return (
    <>
      <PageHeader>
        <PageHeader.Title
          title="Form Subtask"
          subtitle="This task will define the form for the given feature"
          backLabel="Back to Type Selection"
        />
      </PageHeader>

      <PageContent>
        <CreateFormSubtaskForm taskId={taskId} />
      </PageContent>
    </>
  );
}
