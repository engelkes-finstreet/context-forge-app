import { TypedLink, routes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { PageContent } from "@/components/ui/page-content";
import { CreateTemplateForm } from "@/features/templates/components/forms/create-template/create-template-form";
import { ArrowLeft } from "lucide-react";

export default async function NewTemplatePage() {
  return (
    <>
      <TypedLink
        route={routes.templates.list}
        params={{}}
        data-transition-ignore
      >
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Templates
        </Button>
      </TypedLink>

      <PageHeader>
        <PageHeader.Title
          title="Create New Template"
          subtitle="Define a reusable blueprint for creating tasks with predefined subtasks"
        />
      </PageHeader>

      <PageContent>
        <CreateTemplateForm />
      </PageContent>
    </>
  );
}
