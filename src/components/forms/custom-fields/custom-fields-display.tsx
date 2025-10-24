import { CustomFieldDefinition } from "@/lib/types/custom-fields";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomFieldsDisplayProps {
  /** Custom field definitions from the project */
  fieldDefinitions: CustomFieldDefinition[];
  /** Custom field values from subtask metadata */
  fieldValues: Record<string, string | null | undefined>;
}

/**
 * Displays custom field values in a read-only view
 *
 * Used to show custom field data on subtask detail pages
 */
export function CustomFieldsDisplay({
  fieldDefinitions,
  fieldValues,
}: CustomFieldsDisplayProps) {
  if (fieldDefinitions.length === 0) {
    return null;
  }

  const sortedFields = [...fieldDefinitions].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Project Custom Fields</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sortedFields.map((field) => {
            const value = fieldValues[field.name];
            const displayValue = value || "—";

            return (
              <div key={field.id} className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground">
                  {field.label}
                  {field.required && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Required
                    </Badge>
                  )}
                </dt>
                <dd className="text-sm">{displayValue}</dd>
              </div>
            );
          })}
        </dl>
      </CardContent>
    </Card>
  );
}
