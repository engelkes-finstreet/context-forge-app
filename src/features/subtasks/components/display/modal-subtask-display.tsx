import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import { Badge } from "@/components/ui/badge";
import { ModalSubtaskMetadata } from "@/features/subtasks/forms/modal-subtask/modal-subtask-form-schema";
import {
  CheckCircle2,
  XCircle,
  Key,
  Type,
  Languages,
  FileText,
} from "lucide-react";

interface ModalSubtaskDisplayProps {
  content: string;
  metadata: ModalSubtaskMetadata;
}

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
      {/* Modal Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Modal Configuration</CardTitle>
          <CardDescription>
            Dialog appearance and behavior settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Types */}
          {metadata.dataTypes && metadata.dataTypes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Data Types ({metadata.dataTypes.length})
              </h3>
              <div className="space-y-3">
                {metadata.dataTypes.map((dataType, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 space-y-2 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="text-primary">
                          <Key className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">
                            {dataType.keyName}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Type className="h-3 w-3" />
                        {dataType.dataType}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Translations */}
          {metadata.translations && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Translations
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Title</div>
                  <div className="text-sm text-muted-foreground">
                    {metadata.translations.title}
                  </div>
                </div>
                {metadata.translations.subheading && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Subheading</div>
                    <div className="text-sm text-muted-foreground">
                      {metadata.translations.subheading}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Settings
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-2">
                {metadata.withOpenButton ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Open button enabled</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Open button disabled
                    </span>
                  </>
                )}
              </div>
              {metadata.contentDescription && (
                <div className="space-y-1">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Content Description
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {metadata.contentDescription}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content - Moved to bottom */}
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
