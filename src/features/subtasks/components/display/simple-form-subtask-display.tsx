import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import { Badge } from "@/components/ui/badge";
import { FileCode } from "lucide-react";

interface SimpleFormMetadata {
  simpleFormName: string;
  swaggerPath: string;
  description: string;
}

interface SimpleFormSubtaskDisplayProps {
  content: string;
  metadata: SimpleFormMetadata;
}

/**
 * Simple Form Subtask Display Component
 *
 * Displays simple form configuration with swagger path and description.
 */
export function SimpleFormSubtaskDisplay({
  content,
  metadata,
}: SimpleFormSubtaskDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Form Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Simple Form Configuration</CardTitle>
          <CardDescription>
            Basic form setup with API endpoint reference
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Form Name */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Form Name
            </h3>
            <p className="text-lg font-medium">{metadata.simpleFormName}</p>
          </div>

          {/* Swagger Path */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              API Endpoint
            </h3>
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-primary" />
              <code className="text-sm bg-muted px-3 py-1.5 rounded border flex-1">
                {metadata.swaggerPath}
              </code>
              <Badge variant="outline">Swagger</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Markdown content={content} />
        </CardContent>
      </Card>
    </div>
  );
}
