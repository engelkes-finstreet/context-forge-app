'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FieldPath, FieldValues } from 'react-hook-form';
import { InputFieldConfig } from '@/components/forms/dynamic-form-field/types';

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends React.InputHTMLAttributes<HTMLInputElement> {
  name: TName;
  fieldConfig: InputFieldConfig<any, any>;
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, fieldConfig }: FormInputProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          {fieldConfig.label && <FormLabel>{fieldConfig.label}</FormLabel>}
          <FormControl>
            <Input
              {...field}
              placeholder={fieldConfig.placeholder}
              type={fieldConfig.inputType || 'text'}
            />
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
