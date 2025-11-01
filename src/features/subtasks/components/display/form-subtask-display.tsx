import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import { Badge } from "@/components/ui/badge";
import { FormMetadata } from "@/features/subtasks/types/subtask-types";
import {
  CheckCircle2,
  Type,
  Mail,
  Lock,
  Hash,
  List,
  CheckSquare,
  Circle,
  Calendar,
  FileText,
} from "lucide-react";

interface FormSubtaskDisplayProps {
  content: string;
  metadata: FormMetadata;
}

const fieldTypeIcons: Record<string, React.ReactNode> = {
  text: <Type className="h-4 w-4" />,
  textarea: <FileText className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  password: <Lock className="h-4 w-4" />,
  number: <Hash className="h-4 w-4" />,
  select: <List className="h-4 w-4" />,
  checkbox: <CheckSquare className="h-4 w-4" />,
  radio: <Circle className="h-4 w-4" />,
  date: <Calendar className="h-4 w-4" />,
};

/**
 * Form Subtask Display Component
 *
 * Displays form configuration with field definitions and validation rules.
 */
export function FormSubtaskDisplay({
  content,
  metadata,
}: FormSubtaskDisplayProps) {
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

      {/* Form Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Form Configuration</CardTitle>
          <CardDescription>
            Field definitions and validation rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form Fields */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Fields ({metadata.fields.length})
            </h3>
            <div className="space-y-3">
              {metadata.fields.map((field, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-2 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="text-primary">
                        {fieldTypeIcons[field.type] || <Type className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{field.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {field.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{field.type}</Badge>
                      {field.required && (
                        <Badge variant="destructive" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                  </div>

                  {field.description && (
                    <p className="text-sm text-muted-foreground pl-6">
                      {field.description}
                    </p>
                  )}

                  {field.placeholder && (
                    <div className="pl-6 text-sm">
                      <span className="text-muted-foreground">Placeholder:</span>{" "}
                      <span className="italic">{field.placeholder}</span>
                    </div>
                  )}

                  {field.options && field.options.length > 0 && (
                    <div className="pl-6 space-y-1">
                      <div className="text-sm text-muted-foreground">Options:</div>
                      <div className="flex flex-wrap gap-2">
                        {field.options.map((option, optIdx) => (
                          <Badge key={optIdx} variant="secondary">
                            {option.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {field.validation && (
                    <div className="pl-6 text-sm">
                      <span className="text-muted-foreground">Validation:</span>{" "}
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {field.validation}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Settings */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {metadata.submitEndpoint && (
                <div className="space-y-1">
                  <div className="text-sm font-medium">Submit Endpoint</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded block">
                    {metadata.submitEndpoint}
                  </code>
                </div>
              )}
              {metadata.submitButtonText && (
                <div className="space-y-1">
                  <div className="text-sm font-medium">Submit Button Text</div>
                  <div className="text-sm text-muted-foreground">
                    {metadata.submitButtonText}
                  </div>
                </div>
              )}
              {metadata.showResetButton && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm">Reset button enabled</span>
                </div>
              )}
              {metadata.resetButtonText && (
                <div className="space-y-1">
                  <div className="text-sm font-medium">Reset Button Text</div>
                  <div className="text-sm text-muted-foreground">
                    {metadata.resetButtonText}
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
