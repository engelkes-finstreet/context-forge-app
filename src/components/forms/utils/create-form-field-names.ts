import { FieldNamesType, FormFieldsType } from '@/components/forms/types';

export function createFormFieldNames<F extends FormFieldsType<any, any>>(
  fields: F,
  parentKey = ''
): FieldNamesType<F> {
  const result = {} as FieldNamesType<F>;

  for (const key in fields) {
    const field = fields[key];
    // Build a dot-path ("parent.child.grandChild") if parentKey is non-empty
    const path = parentKey ? `${parentKey}.${key}` : key;

    if (!('type' in field)) {
      // 1) Nested object
      (result[key] as any) = createFormFieldNames(
        field as FormFieldsType<any, any>,
        path
      );
    } else if (field.type === 'array') {
      // 2) Array field
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { type, ...subFields } = field;
      (result[key] as any) = {
        fieldName: path,
        fields: createFormFieldNames(subFields as FormFieldsType<any, any>, ''),
      } as FieldNamesType<F>[keyof F];
    } else {
      // 3) Normal field (e.g. "input", "textarea", etc.)
      (result[key] as any) = path as FieldNamesType<F>[keyof F];
    }
  }

  return result as FieldNamesType<F>;
}
