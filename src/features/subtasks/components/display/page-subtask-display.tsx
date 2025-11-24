import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Globe } from "lucide-react";
import { PageType } from "@/features/subtasks/forms/page-subtask/use-page-type-options";

interface PageMetadata {
  pageType: PageType;
  translations: {
    title: string;
    description?: string;
  };
}

interface PageSubtaskDisplayProps {
  content: string;
  metadata: PageMetadata;
}

/**
 * Page Subtask Display Component
 *
 * Displays page configuration with type and translations.
 */
export function PageSubtaskDisplay({
  content,
  metadata,
}: PageSubtaskDisplayProps) {
  const isInquiry = metadata.pageType === PageType.INQUIRY;

  return (
    <div className="space-y-6">
      {/* Page Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Page Configuration</CardTitle>
          <CardDescription>Page type and translation settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Page Type */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Page Type
            </h3>
            <div className="flex items-center gap-2">
              {isInquiry ? (
                <FileText className="h-5 w-5 text-blue-500" />
              ) : (
                <Globe className="h-5 w-5 text-green-500" />
              )}
              <Badge
                variant={isInquiry ? "default" : "secondary"}
                className="capitalize"
              >
                {metadata.pageType}
              </Badge>
            </div>
          </div>

          {/* Translations */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Translations
            </h3>

            <div className="grid gap-4">
              {/* Title */}
              <div className="border rounded-lg p-4 space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Title
                </p>
                <code className="text-sm bg-muted px-2 py-1 rounded block">
                  {metadata.translations.title}
                </code>
              </div>

              {/* Description (only for inquiry) */}
              {isInquiry && metadata.translations.description && (
                <div className="border rounded-lg p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Description
                  </p>
                  <code className="text-sm bg-muted px-2 py-1 rounded block">
                    {metadata.translations.description}
                  </code>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
