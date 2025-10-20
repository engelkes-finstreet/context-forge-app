'use client';

import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FieldPath, FieldValues } from 'react-hook-form';
import { TextareaFieldConfig } from '@/components/forms/dynamic-form-field/types';

interface FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: TName;
  fieldConfig: TextareaFieldConfig<any, any>;
}

export function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, fieldConfig }: FormTextareaProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          {fieldConfig.label && <FormLabel>{fieldConfig.label}</FormLabel>}
          <FormControl>
            <Textarea
              {...field}
              placeholder={fieldConfig.placeholder}
              rows={fieldConfig.rows || 4}
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
