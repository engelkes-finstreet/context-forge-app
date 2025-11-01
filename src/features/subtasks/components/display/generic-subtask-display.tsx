import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";

interface GenericSubtaskDisplayProps {
  content: string;
}

/**
 * Generic Subtask Display Component
 *
 * Simple display for generic subtasks that only have markdown content.
 */
export function GenericSubtaskDisplay({
  content,
}: GenericSubtaskDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content</CardTitle>
      </CardHeader>
      <CardContent>
        <Markdown content={content} />
      </CardContent>
    </Card>
  );
}
