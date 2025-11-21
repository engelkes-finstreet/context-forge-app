"use client";

import {
  createContext,
  Fragment,
  ReactNode,
  useActionState,
  useContext,
  useEffect,
  useTransition,
  useRef,
} from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, FormProvider, useForm } from "react-hook-form";

import { FormConfig, FormState } from "@/components/forms/types";
import { useFormIsPending } from "@/components/forms/form-state-store";

function useServerAction<State extends FormState>(
  formConfig: FormConfig<State, any>,
): { state: State | null; serverAction: (values: any) => void } {
  const { serverAction, useErrorAction, useSuccessAction } = formConfig;
  const errorAction = useErrorAction?.();
  const successAction = useSuccessAction?.();
  const processedStateRef = useRef<State | null>(null);

  const [state, formAction] = useActionState<State | null, any>(
    serverAction,
    null,
  );

  useEffect(() => {
    if (!state) return;

    // Check if we've already processed this exact state instance
    if (processedStateRef.current === state) return;

    if (state.error) {
      errorAction?.(state);
    } else {
      successAction?.(state);
    }

    // Mark this state instance as processed
    processedStateRef.current = state;
  }, [state, errorAction, successAction]);

  return {
    state,
    serverAction: formAction,
  };
}

type Props = {
  formConfig: FormConfig<any, any, any, any>;
  children: React.ReactNode;
};

export const Form = ({ formConfig, children }: Props) => {
  const { serverAction, state } = useServerAction<FormState>(formConfig);
  const [isPending, startTransition] = useTransition();
  const { setData: setFormState } = useFormIsPending();

  const methods = useForm({
    resolver: zodResolver(formConfig.schema as any),
    mode: formConfig.mode ?? "onBlur",
    defaultValues: formConfig.defaultValues,
  });

  useEffect(() => {
    setFormState({ isPending });
  }, [isPending, setFormState]);

  return (
    <FormProvider {...methods}>
      <FormConfigProvider formConfig={formConfig}>
        <form
          id={formConfig.formId}
          action={serverAction}
          onSubmit={(evt) => {
            evt.preventDefault();
            methods.handleSubmit(() => {
              startTransition(() => {
                const formValues = methods.getValues();
                const parsedFormValues =
                  formConfig.schema.safeParse(formValues);
                if (!parsedFormValues.success) {
                  return;
                }
                serverAction(parsedFormValues.data);
              });
            })(evt);
          }}
        >
          {state?.error && (
            <div className="mb-8">
              {state.error.split("\n").map((line, index) => (
                <Fragment key={index}>
                  {line}
                  <br />
                </Fragment>
              ))}
            </div>
          )}
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

type FormConfigContextValueType =
  | {
      formConfig: FormConfig<any, any>;
    }
  | undefined;

const FormConfigContext = createContext<FormConfigContextValueType>(undefined);

export const FormConfigProvider = ({
  children,
  formConfig,
}: {
  children: ReactNode;
  formConfig: FormConfig<any, any, any, any>;
}) => {
  return (
    <FormConfigContext.Provider value={{ formConfig }}>
      {children}
    </FormConfigContext.Provider>
  );
};

export function useFormConfig<
  State extends FormState,
  FormInput extends FieldValues,
  FormOutput extends FieldValues = FormInput,
  CustomFields = never,
>(): FormConfig<State, FormInput, FormOutput, CustomFields> {
  const context = useContext(FormConfigContext);

  if (!context) {
    throw new Error("useFormConfig must be used within a <FormConfigProvider>");
  }

  return context.formConfig as FormConfig<
    State,
    FormInput,
    FormOutput,
    CustomFields
  >;
}
