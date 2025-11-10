import { SelectOptions } from "@/components/forms/dynamic-form-field/types";

export enum SuffixOptions {
  NONE = "none",
  SQUARE_METER = "m²",
  EUR = "€",
}

export function useSuffixOptions(): SelectOptions {
  return [
    { label: "None", value: SuffixOptions.NONE },
    { label: "Square Meter", value: SuffixOptions.SQUARE_METER },
    { label: "EUR", value: SuffixOptions.EUR },
  ];
}
