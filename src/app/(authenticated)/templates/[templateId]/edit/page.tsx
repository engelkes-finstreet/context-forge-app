import { notFound } from "next/navigation";
import { TypedLink, routes } from "@/lib/routes";
import { TemplateService } from "@/lib/services/template-service";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { PageContent } from "@/components/ui/page-content";
import { EditTemplateForm } from "@/features/templates/components/forms/edit-template/edit-template-form";
import { ArrowLeft } from "lucide-react";

interface EditTemplatePageProps {
  params: Promise<{
    templateId: string;
  }>;
}

export default async function EditTemplatePage({
  params,
}: EditTemplatePageProps) {
  const { templateId } = await params;
  const template = await TemplateService.getById(templateId);

  if (!template) {
    notFound();
  }

  return (
    <>
      <TypedLink
        route={routes.templates.detail}
        params={{ templateId }}
        data-transition-ignore
      >
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Template
        </Button>
      </TypedLink>

      <PageHeader>
        <PageHeader.Title
          title="Edit Template"
          subtitle={`Modify ${template.name}`}
        />
      </PageHeader>

      <PageContent>
        <EditTemplateForm
          templateId={templateId}
          initialData={{
            name: template.name,
            description: template.description,
            subtaskTemplates: template.subtaskTemplates.map((st) => ({
              name: st.name,
              type: st.type,
              content: st.content,
              metadata: st.metadata,
              order: st.order,
              required: st.required,
            })),
          }}
        />
      </PageContent>
    </>
  );
}
