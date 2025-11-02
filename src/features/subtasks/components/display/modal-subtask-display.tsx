import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import { Badge } from "@/components/ui/badge";
import { ModalMetadata } from "@/features/subtasks/types/subtask-types";
import {
  CheckCircle2,
  XCircle,
  MousePointerClick,
  Link,
  Sparkles,
  Maximize2,
} from "lucide-react";

interface ModalSubtaskDisplayProps {
  content: string;
  metadata: ModalMetadata;
}

const sizeLabels: Record<string, string> = {
  sm: "Small",
  md: "Medium",
  lg: "Large",
  xl: "Extra Large",
  full: "Full Screen",
};

const triggerTypeIcons: Record<string, React.ReactNode> = {
  button: <MousePointerClick className="h-4 w-4" />,
  link: <Link className="h-4 w-4" />,
  automatic: <Sparkles className="h-4 w-4" />,
};

/**
 * Modal Subtask Display Component
 *
 * Displays modal dialog configuration including size, trigger, and behavior settings.
 */
export function ModalSubtaskDisplay({
  content,
  metadata,
}: ModalSubtaskDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Modal Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Markdown content={content} />
        </CardContent>
      </Card>

      {/* Modal Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Modal Configuration</CardTitle>
          <CardDescription>
            Dialog appearance and behavior settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Modal Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Modal Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Size */}
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Maximize2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Size</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-base">
                    {metadata.size ? sizeLabels[metadata.size] : "Medium"}
                  </Badge>
                </div>
              </div>

              {/* Trigger Type */}
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {triggerTypeIcons[metadata.triggerType]}
                  <span className="text-sm font-medium">Trigger Type</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-base capitalize">
                    {metadata.triggerType}
                  </Badge>
                </div>
              </div>
            </div>

            {metadata.triggerText && (
              <div className="border rounded-lg p-4 space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Trigger Text
                </div>
                <div className="font-medium">{metadata.triggerText}</div>
              </div>
            )}

            {(metadata.modalTitle || metadata.modalDescription) && (
              <div className="border rounded-lg p-4 space-y-3">
                {metadata.modalTitle && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Modal Title
                    </div>
                    <div className="font-semibold">{metadata.modalTitle}</div>
                  </div>
                )}
                {metadata.modalDescription && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Modal Description
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {metadata.modalDescription}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Behavior Settings */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Behavior
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  metadata.showCloseButton
                    ? "bg-success/10 border-success/20"
                    : "bg-muted"
                }`}
              >
                {metadata.showCloseButton ? (
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <div>
                  <div className="text-sm font-medium">Close Button</div>
                  <div className="text-xs text-muted-foreground">
                    {metadata.showCloseButton ? "Visible" : "Hidden"}
                  </div>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  metadata.closeOnOutsideClick
                    ? "bg-success/10 border-success/20"
                    : "bg-muted"
                }`}
              >
                {metadata.closeOnOutsideClick ? (
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <div>
                  <div className="text-sm font-medium">Outside Click</div>
                  <div className="text-xs text-muted-foreground">
                    {metadata.closeOnOutsideClick ? "Closes" : "Ignored"}
                  </div>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  metadata.closeOnEscape
                    ? "bg-success/10 border-success/20"
                    : "bg-muted"
                }`}
              >
                {metadata.closeOnEscape ? (
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <div>
                  <div className="text-sm font-medium">Escape Key</div>
                  <div className="text-xs text-muted-foreground">
                    {metadata.closeOnEscape ? "Closes" : "Ignored"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
