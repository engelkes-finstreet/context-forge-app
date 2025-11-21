import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Database } from "lucide-react";

interface RequestMetadata {
  requests: Array<{
    endpoint: string;
    requestType: string;
    paginated: boolean;
    protected: boolean;
  }>;
}

interface RequestSubtaskDisplayProps {
  content: string;
  metadata: RequestMetadata;
}

const requestTypeColors: Record<string, string> = {
  GET: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  POST: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  PUT: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  PATCH:
    "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  DELETE: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

/**
 * Request Subtask Display Component
 *
 * Displays API request configurations with endpoints, methods, and options.
 */
export function RequestSubtaskDisplay({
  content,
  metadata,
}: RequestSubtaskDisplayProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Requests</CardTitle>
          <CardDescription>
            Endpoint configurations and request settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Endpoints ({metadata.requests.length})
            </h3>
            <div className="space-y-3">
              {metadata.requests.map((request, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-3 hover:border-primary/50 transition-colors"
                >
                  {/* Request Header */}
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          className={`font-mono font-bold ${
                            requestTypeColors[request.requestType] ||
                            "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
                          }`}
                        >
                          {request.requestType}
                        </Badge>
                        <code className="text-sm bg-muted px-2 py-1 rounded flex-1 min-w-0 break-all">
                          {request.endpoint}
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Request Properties */}
                  <div className="flex flex-wrap gap-2 pl-2">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm ${
                        request.paginated
                          ? "bg-info/10 border-info/20 text-info"
                          : "bg-muted border-border text-muted-foreground"
                      }`}
                    >
                      <Database className="h-3.5 w-3.5" />
                      <span>Paginated</span>
                      {request.paginated ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                    </div>

                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm ${
                        request.protected
                          ? "bg-warning/10 border-warning/20 text-warning"
                          : "bg-muted border-border text-muted-foreground"
                      }`}
                    >
                      <span>Protected</span>
                      {request.protected ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
