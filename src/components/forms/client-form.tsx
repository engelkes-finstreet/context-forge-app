"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { ClientFormConfig } from "@/components/forms/types";
import { useFormIsPending } from "@/components/forms/form-state-store";
import { FormConfigProvider } from "@/components/forms/form";

type Props = {
  formConfig: ClientFormConfig<any, any, any>;
  children: React.ReactNode;
};

export const ClientForm = ({ formConfig, children }: Props) => {
  const [isPending, startTransition] = useTransition();
  const { setData: setFormState } = useFormIsPending();
  const [error, setError] = useState<string | null>(null);

  const methods = useForm({
    resolver: zodResolver(formConfig.schema as any),
    mode: "onBlur",
    defaultValues: formConfig.defaultValues,
  });

  useEffect(() => {
    setFormState({ isPending });
  }, [isPending, setFormState]);

  const handleSubmit = async (data: FieldValues) => {
    setError(null);
    startTransition(async () => {
      try {
        await formConfig.onSubmit(data);
      } catch (err: any) {
        console.error("[ClientForm] Submit error:", err);
        setError(err?.message || "Something went wrong. Please try again.");
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <FormConfigProvider formConfig={formConfig as any}>
        <form
          id={formConfig.formId}
          onSubmit={(evt) => {
            evt.preventDefault();
            methods.handleSubmit(handleSubmit)(evt);
          }}
        >
          {error && <div className="mb-8 text-destructive">{error}</div>}
          {children}
          {!formConfig.hideActions && (
            <div className="mt-8">
              {formConfig.renderFormActions(isPending)}
            </div>
          )}
        </form>
      </FormConfigProvider>
    </FormProvider>
  );
};
