import { TypedLink, routes } from "@/lib/routes";
import { TemplateService } from "@/lib/services/template-service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { PageContent } from "@/components/ui/page-content";
import {
  StaggeredContainer,
  StaggeredItem,
} from "@/components/ui/staggered-container";
import { PlusCircle } from "lucide-react";

export default async function TemplatesPage() {
  const templates = await TemplateService.getAll();

  return (
    <>
      <PageHeader>
        <PageHeader.Title
          title="Task Templates"
          subtitle="Reusable blueprints for common task patterns"
        />
        <PageHeader.Actions>
          <TypedLink route={routes.templates.new} params={{}}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </TypedLink>
        </PageHeader.Actions>
      </PageHeader>

      <PageContent>
        {templates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground mb-4">No templates yet</p>
              <TypedLink route={routes.templates.new} params={{}}>
                <Button>Create Your First Template</Button>
              </TypedLink>
            </CardContent>
          </Card>
        ) : (
          <StaggeredContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <StaggeredItem key={template.id}>
                <TypedLink
                  route={routes.templates.detail}
                  params={{ templateId: template.id }}
                >
                  <Card interactive={true}>
                    <CardHeader>
                      <CardTitle>{template.name}</CardTitle>
                      {template.description && (
                        <CardDescription>{template.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>
                          {template._count.subtaskTemplates}{" "}
                          {template._count.subtaskTemplates === 1
                            ? "subtask"
                            : "subtasks"}
                        </div>
                        {template.usageCount > 0 && (
                          <div className="text-xs">
                            Used {template.usageCount}{" "}
                            {template.usageCount === 1 ? "time" : "times"}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TypedLink>
              </StaggeredItem>
            ))}
          </StaggeredContainer>
        )}
      </PageContent>
    </>
  );
}
