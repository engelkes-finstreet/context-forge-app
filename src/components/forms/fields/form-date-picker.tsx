"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FieldPath, FieldValues } from "react-hook-form";
import { DatePickerFieldConfig } from "@/components/forms/dynamic-form-field/types";
import { format } from "date-fns";

interface FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  fieldConfig: DatePickerFieldConfig<any, any>;
}

export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, fieldConfig }: FormDatePickerProps<TFieldValues, TName>) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          {fieldConfig.label && <FormLabel>{fieldConfig.label}</FormLabel>}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  if (date) {
                    // Keep the date in local time, set to start of day
                    const localDate = new Date(date);
                    localDate.setHours(0, 0, 0, 0);
                    field.onChange(localDate);
                  } else {
                    field.onChange(date);
                  }
                  setOpen(false);
                }}
                disabled={fieldConfig.disabled}
              />
            </PopoverContent>
          </Popover>
          {fieldConfig.description && (
            <FormDescription>{fieldConfig.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
