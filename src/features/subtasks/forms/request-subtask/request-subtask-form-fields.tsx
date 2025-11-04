"use client";

import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import {
  CreateRequestSubtaskFormInput,
  Request,
} from "@/features/subtasks/forms/request-subtask/request-subtask-form-schema";
import { Zap, Lock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FieldArrayAccordion } from "@/components/forms/field-array-accordion";
import { useWatch } from "react-hook-form";

type Props = {
  fieldNames: FieldNamesType<FormFieldsType<CreateRequestSubtaskFormInput>>;
};

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-blue-500 hover:bg-blue-600",
  POST: "bg-green-500 hover:bg-green-600",
  PUT: "bg-yellow-500 hover:bg-yellow-600",
  PATCH: "bg-orange-500 hover:bg-orange-600",
  DELETE: "bg-red-500 hover:bg-red-600",
};

export const RequestSubtaskFormFields = ({ fieldNames }: Props) => {
  return (
    <div className="space-y-6">
      <DynamicFormField fieldName={fieldNames.subtaskName} />
      <RequestsFields fieldNames={fieldNames} />
    </div>
  );
};

const RequestSummary = ({
  index,
  arrayFieldName,
}: {
  index: number;
  arrayFieldName: string;
}) => {
  // Subscribe to live form data for real-time updates
  const request = useWatch({
    name: `${arrayFieldName}.${index}`,
  }) as Request | undefined;

  // Parse endpoint format: "GET:/api/path"
  const [method, path] = request?.endpoint?.split(":", 2) || ["", ""];
  const hasEndpoint = method && path;
  const requestType = request?.requestType;

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      {hasEndpoint ? (
        <>
          <Badge
            className={cn(
              "text-white text-xs font-semibold shadow-sm",
              METHOD_COLORS[method] || "bg-gray-500",
            )}
          >
            {method}
          </Badge>
          <span className="text-sm font-mono truncate dark:text-foreground/90">
            {path}
          </span>
        </>
      ) : (
        <span className="text-sm text-muted-foreground italic">
          Not configured
        </span>
      )}

      {requestType && (
        <>
          <span className="text-muted-foreground/60">•</span>
          <span className="text-sm capitalize dark:text-foreground/80">
            {requestType}
          </span>
        </>
      )}

      {request?.paginated && (
        <Badge variant="secondary" className="gap-1">
          <Zap className="size-3" />
          <span className="text-xs">Paginated</span>
        </Badge>
      )}

      {request?.protected && (
        <Badge variant="secondary" className="gap-1">
          <Lock className="size-3" />
          <span className="text-xs">Protected</span>
        </Badge>
      )}

      {request?.resultSchema && (
        <Badge variant="secondary" className="gap-1">
          <FileText className="size-3" />
          <span className="text-xs">Schema</span>
        </Badge>
      )}
    </div>
  );
};

export const RequestsFields = ({ fieldNames }: Props) => {
  return (
    <FieldArrayAccordion
      arrayFieldName={fieldNames.requests.fieldName}
      arrayFieldConfig={fieldNames.requests}
      defaultItem={{
        endpoint: "",
        requestType: undefined,
        paginated: false,
        protected: false,
        resultSchema: false,
      }}
      itemLabel="Request"
      sectionTitle="Requests"
      renderSummary={({ index }) => (
        <RequestSummary
          index={index}
          arrayFieldName={fieldNames.requests.fieldName}
        />
      )}
    >
      {({ buildFieldName, fieldNames: fields }) => (
        <>
          <DynamicFormField fieldName={buildFieldName(fields.endpoint)} />
          <DynamicFormField fieldName={buildFieldName(fields.requestType)} />

          <div className="space-y-2">
            <p className="text-sm font-medium dark:text-foreground/90">Options</p>
            <div className="flex flex-wrap gap-4">
              <DynamicFormField fieldName={buildFieldName(fields.paginated)} />
              <DynamicFormField fieldName={buildFieldName(fields.protected)} />
              <DynamicFormField
                fieldName={buildFieldName(fields.resultSchema)}
              />
            </div>
          </div>
        </>
      )}
    </FieldArrayAccordion>
  );
};
