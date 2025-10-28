import { FieldSet, FieldLegend } from "@/components/ui/field";

export const HiddenFields = () => {
  return (
    <FieldSet>
      <FieldLegend className="text-base font-semibold mb-4">
        Hidden Field Configuration
      </FieldLegend>
      <div className="text-sm text-muted-foreground mb-4">
        Hidden fields are not visible to users but will be included in the form
        data.
      </div>
    </FieldSet>
  );
};
