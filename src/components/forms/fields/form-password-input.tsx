'use client';

import * as React from 'react';
import { PasswordInput } from '@/components/ui/password-input';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FieldPath, FieldValues } from 'react-hook-form';
import { PasswordFieldConfig } from '@/components/forms/dynamic-form-field/types';

interface FormPasswordInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends React.InputHTMLAttributes<HTMLInputElement> {
  name: TName;
  fieldConfig: PasswordFieldConfig<any, any>;
}

export function FormPasswordInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, fieldConfig }: FormPasswordInputProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          {fieldConfig.label && <FormLabel>{fieldConfig.label}</FormLabel>}
          <FormControl>
            <PasswordInput {...field} placeholder={fieldConfig.placeholder} />
          </FormControl>
          {fieldConfig.description && (
            <FormDescription>{fieldConfig.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
