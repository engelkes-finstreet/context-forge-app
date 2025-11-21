import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import { ModalMetadata } from "@/features/subtasks/types/subtask-types";

interface ModalSubtaskDisplayProps {
  content: string;
  metadata: ModalMetadata;
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
        <CardContent className="space-y-6">Add this later</CardContent>
      </Card>
    </div>
  );
}
