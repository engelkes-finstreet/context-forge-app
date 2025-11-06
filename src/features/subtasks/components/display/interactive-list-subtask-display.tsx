import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import { Badge } from "@/components/ui/badge";
import { Columns, Grid3x3 } from "lucide-react";

interface PresentationListMetadata {
  columns: Array<{
    name: string;
    translation: string;
    gridTemplateColumns: number;
  }>;
  noItemTranslation: string;
}

interface InteractiveListSubtaskDisplayProps {
  content: string;
  metadata: PresentationListMetadata;
}

/**
 * Presentation List Subtask Display Component
 *
 * Displays list/table presentation configuration with column definitions.
 */
export function InteractiveListSubtaskDisplay({
  content,
  metadata,
}: InteractiveListSubtaskDisplayProps) {
  const totalColumns = metadata.columns.reduce(
    (sum, col) => sum + col.gridTemplateColumns,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Markdown content={content} />
        </CardContent>
      </Card>

      {/* Presentation Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>List Configuration</CardTitle>
          <CardDescription>Column definitions and grid layout</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Columns */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Columns ({metadata.columns.length})
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Grid3x3 className="h-4 w-4" />
                <span>
                  Grid: {totalColumns}/12
                  {totalColumns === 12 && (
                    <Badge variant="success" className="ml-2 text-xs">
                      Valid
                    </Badge>
                  )}
                  {totalColumns !== 12 && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      Invalid
                    </Badge>
                  )}
                </span>
              </div>
            </div>

            {/* Column Visual Preview */}
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="grid grid-cols-12 gap-2">
                {metadata.columns.map((column, index) => (
                  <div
                    key={index}
                    className="bg-primary/20 border-2 border-primary/40 rounded p-2 text-center"
                    style={{ gridColumn: `span ${column.gridTemplateColumns}` }}
                  >
                    <div className="text-xs font-medium text-primary">
                      {column.translation}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {column.gridTemplateColumns} col
                      {column.gridTemplateColumns !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column Details */}
            <div className="space-y-3">
              {metadata.columns.map((column, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Columns className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="space-y-1 flex-1">
                        <div className="font-semibold">
                          {column.translation}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Field:{" "}
                          <code className="bg-muted px-1.5 py-0.5 rounded">
                            {column.name}
                          </code>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {column.gridTemplateColumns}/12
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Settings
            </h3>
            <div className="border rounded-lg p-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  Empty State Message
                </div>
                <div className="text-base font-medium">
                  {metadata.noItemTranslation}
                </div>
                <div className="text-xs text-muted-foreground">
                  Displayed when the list is empty
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">
                  {metadata.columns.length}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Total Columns
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-info">
                  {totalColumns}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Grid Columns Used
                </div>
              </div>
              <div className="space-y-1">
                <div
                  className={`text-2xl font-bold ${
                    totalColumns === 12 ? "text-success" : "text-destructive"
                  }`}
                >
                  {totalColumns === 12 ? "✓" : "✗"}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Layout Valid
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
