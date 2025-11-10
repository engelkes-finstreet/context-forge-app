import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  List,
  Search,
  ArrowUpDown,
  FolderTree,
  FileCode,
  Route,
} from "lucide-react";

interface ListActionsMetadata {
  pagePath: string;
  withSearch: boolean;
  withSort: boolean;
  withGrouping: boolean;
  interactiveLists: Array<{
    swaggerPath: string;
    name: string;
  }>;
}

interface ListActionsSubtaskDisplayProps {
  content: string;
  metadata: ListActionsMetadata;
}

/**
 * List Actions and Pagination Subtask Display Component
 *
 * Displays list actions configuration including page path, feature flags, and interactive lists.
 */
export function ListActionsSubtaskDisplay({
  content,
  metadata,
}: ListActionsSubtaskDisplayProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>List Actions Configuration</CardTitle>
          <CardDescription>
            Interactive list settings and pagination configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Page Configuration */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Page Configuration
            </h3>
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Route className="h-4 w-4" />
                <span className="text-sm font-medium">Page Path</span>
              </div>
              <code className="text-sm bg-muted px-2 py-1 rounded block break-all">
                {metadata.pagePath}
              </code>
            </div>
          </div>

          {/* Interactive Lists */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Interactive Lists ({metadata.interactiveLists.length})
            </h3>
            <div className="space-y-3">
              {metadata.interactiveLists.map((list, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-3 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <List className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="font-semibold">{list.name}</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileCode className="h-3.5 w-3.5" />
                          <span>Swagger Path:</span>
                        </div>
                        <code className="text-xs bg-muted px-2 py-1 rounded block break-all">
                          {list.swaggerPath}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {metadata.interactiveLists.length === 0 && (
              <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground">
                <List className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No interactive lists configured</p>
              </div>
            )}
          </div>

          {/* Feature Flags */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Feature Flags
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  metadata.withSearch
                    ? "bg-success/10 border-success/20"
                    : "bg-muted"
                }`}
              >
                {metadata.withSearch ? (
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <Search
                  className={`h-4 w-4 ${
                    metadata.withSearch
                      ? "text-success"
                      : "text-muted-foreground"
                  } flex-shrink-0`}
                />
                <div>
                  <div className="text-sm font-medium">Search</div>
                  <div className="text-xs text-muted-foreground">
                    {metadata.withSearch ? "Enabled" : "Disabled"}
                  </div>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  metadata.withSort
                    ? "bg-success/10 border-success/20"
                    : "bg-muted"
                }`}
              >
                {metadata.withSort ? (
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <ArrowUpDown
                  className={`h-4 w-4 ${
                    metadata.withSort ? "text-success" : "text-muted-foreground"
                  } flex-shrink-0`}
                />
                <div>
                  <div className="text-sm font-medium">Sort</div>
                  <div className="text-xs text-muted-foreground">
                    {metadata.withSort ? "Enabled" : "Disabled"}
                  </div>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  metadata.withGrouping
                    ? "bg-success/10 border-success/20"
                    : "bg-muted"
                }`}
              >
                {metadata.withGrouping ? (
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <FolderTree
                  className={`h-4 w-4 ${
                    metadata.withGrouping
                      ? "text-success"
                      : "text-muted-foreground"
                  } flex-shrink-0`}
                />
                <div>
                  <div className="text-sm font-medium">Grouping</div>
                  <div className="text-xs text-muted-foreground">
                    {metadata.withGrouping ? "Enabled" : "Disabled"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
