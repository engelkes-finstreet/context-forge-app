import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import { Badge } from "@/components/ui/badge";
import { InquiryProcessMetadata } from "@/features/subtasks/types/subtask-types";
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  RotateCcw,
  Save,
} from "lucide-react";

interface InquiryProcessSubtaskDisplayProps {
  content: string;
  metadata: InquiryProcessMetadata;
}

const progressStyleIcons: Record<string, React.ReactNode> = {
  linear: <ChevronRight className="h-4 w-4" />,
  circular: <Circle className="h-4 w-4" />,
  steps: <CheckCircle2 className="h-4 w-4" />,
};

/**
 * Inquiry Process Subtask Display Component
 *
 * Displays multi-step form wizard configuration with progress tracking.
 */
export function InquiryProcessSubtaskDisplay({
  content,
  metadata,
}: InquiryProcessSubtaskDisplayProps) {
  console.log({ metadata });
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

      {/* Process Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Inquiry Process Configuration</CardTitle>
          <CardDescription>
            Multi-step wizard with progress tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Steps ({metadata.steps.length})
              </h3>
              {metadata.progressBarStyle && (
                <div className="flex items-center gap-2">
                  {progressStyleIcons[metadata.progressBarStyle]}
                  <span className="text-sm text-muted-foreground capitalize">
                    {metadata.progressBarStyle} Progress
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {metadata.steps
                .sort((a, b) => a.order - b.order)
                .map((step, index) => (
                  <div key={step.id} className="relative">
                    <div
                      className={`border rounded-lg p-4 hover:border-primary/50 transition-colors ${
                        metadata.currentStep === step.id
                          ? "border-primary bg-primary/5"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Step Number */}
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                            metadata.currentStep === step.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>

                        {/* Step Details */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">{step.name}</div>
                            {metadata.currentStep === step.id && (
                              <Badge variant="default">Current</Badge>
                            )}
                          </div>
                          {step.description && (
                            <p className="text-sm text-muted-foreground">
                              {step.description}
                            </p>
                          )}
                          <div className="text-xs text-muted-foreground">
                            ID:{" "}
                            <code className="bg-muted px-1 py-0.5 rounded">
                              {step.id}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connector Line */}
                    {index < metadata.steps.length - 1 && (
                      <div className="absolute left-4 top-full w-0.5 h-2 bg-border -mt-0 translate-y-0" />
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metadata.allowBackNavigation !== undefined && (
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    metadata.allowBackNavigation
                      ? "bg-success/10 border-success/20"
                      : "bg-muted"
                  }`}
                >
                  <RotateCcw
                    className={`h-5 w-5 ${
                      metadata.allowBackNavigation
                        ? "text-success"
                        : "text-muted-foreground"
                    }`}
                  />
                  <div>
                    <div className="text-sm font-medium">Back Navigation</div>
                    <div className="text-xs text-muted-foreground">
                      {metadata.allowBackNavigation ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                </div>
              )}

              {metadata.saveProgressOnExit !== undefined && (
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    metadata.saveProgressOnExit
                      ? "bg-success/10 border-success/20"
                      : "bg-muted"
                  }`}
                >
                  <Save
                    className={`h-5 w-5 ${
                      metadata.saveProgressOnExit
                        ? "text-success"
                        : "text-muted-foreground"
                    }`}
                  />
                  <div>
                    <div className="text-sm font-medium">Save on Exit</div>
                    <div className="text-xs text-muted-foreground">
                      {metadata.saveProgressOnExit ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
