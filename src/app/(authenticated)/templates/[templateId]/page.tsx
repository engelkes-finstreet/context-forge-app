import { notFound } from "next/navigation";
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
import { ArrowLeft, Pencil } from "lucide-react";
import { getTypeConfig } from "@/features/subtasks/config/type-config";
import { Badge } from "@/components/ui/badge";

interface TemplateDetailPageProps {
  params: Promise<{
    templateId: string;
  }>;
}

export default async function TemplateDetailPage({
  params,
}: TemplateDetailPageProps) {
  const { templateId } = await params;
  const template = await TemplateService.getById(templateId);

  if (!template) {
    notFound();
  }

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
          title={template.name}
          subtitle={template.description || undefined}
        />
        <PageHeader.Actions>
          <TypedLink route={routes.templates.edit} params={{ templateId }}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Template
            </Button>
          </TypedLink>
        </PageHeader.Actions>
      </PageHeader>

      <PageContent>
        <div className="space-y-6">
          {/* Template Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Template Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Subtasks</p>
                  <p className="text-2xl font-bold">
                    {template.subtaskTemplates.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Times Used</p>
                  <p className="text-2xl font-bold">{template.usageCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tasks Created</p>
                  <p className="text-2xl font-bold">{template._count.tasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subtask Templates */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Subtask Templates</h2>
            {template.subtaskTemplates.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-muted-foreground">
                    No subtask templates defined
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {template.subtaskTemplates.map((subtaskTemplate) => {
                  const typeConfig = getTypeConfig(subtaskTemplate.type);
                  return (
                    <Card key={subtaskTemplate.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                              <span>{typeConfig.icon}</span>
                              <span>{subtaskTemplate.name}</span>
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant={typeConfig.badgeVariant}>
                                {typeConfig.label}
                              </Badge>
                              {subtaskTemplate.required && (
                                <Badge variant="outline">Required</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {subtaskTemplate.content}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </PageContent>
    </>
  );
}
