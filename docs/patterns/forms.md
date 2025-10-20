# Form Pattern

## Overview

All forms in Context Forge follow a consistent pattern based on React Hook Form and Zod validation.

## Form Structure

```
src/features/{feature}/components/forms/{form-name}/
├── {form-name}-form-config.tsx   # Configuration hook
└── {form-name}-form.tsx          # Form component
```

## Form Config Hook Pattern

The form configuration hook defines all form behavior, validation, and handlers.

```typescript
export function useCreateXFormConfig(): FormConfig<XFormState, XInput> {
  const router = useRouter();

  const defaultValues: DeepPartial<XInput> = { /* ... */ };

  const fields: FormFieldsType<XInput> = {
    fieldName: {
      type: 'input',
      inputType: 'text',
      label: 'Field Label',
      placeholder: 'Placeholder text',
    },
  };

  return {
    fields,
    defaultValues,
    schema: createXSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createXAction,
    formId: 'unique-form-id',
    useErrorAction: () => (state) => {
      toast.error(state?.error || 'Error message');
    },
    useSuccessAction: () => (state) => {
      toast.success(state?.message || 'Success message');
      router.push('/redirect-path');
    },
    renderFormActions: (isPending) => (
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </Button>
    ),
  };
}
```

### Configuration Properties

- **fields**: Field definitions with types, labels, and validation
- **defaultValues**: Initial form values
- **schema**: Zod validation schema
- **fieldNames**: Type-safe field name accessors
- **serverAction**: Next.js server action for form submission
- **formId**: Unique identifier for the form
- **useErrorAction**: Handler for form errors
- **useSuccessAction**: Handler for successful submissions
- **renderFormActions**: Custom render for form buttons

## Form Component Pattern

The form component uses the configuration hook and renders fields.

```typescript
export function CreateXForm() {
  const formConfig = useCreateXFormConfig();
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <div className="space-y-6">
        <DynamicFormField fieldName={fieldNames.fieldName} />
      </div>
    </Form>
  );
}
```

## Supported Field Types

### Input

Text-based input fields.

```typescript
{
  type: 'input',
  inputType: 'text' | 'email' | 'number' | 'url',
  label: 'Label',
  placeholder: 'Placeholder',
}
```

### Textarea

Multi-line text input.

```typescript
{
  type: 'textarea',
  label: 'Label',
  placeholder: 'Placeholder',
  rows: 5, // optional
}
```

### Password

Password input with masking.

```typescript
{
  type: 'password',
  label: 'Password',
}
```

### Hidden

Hidden field for metadata (IDs, flags, etc.).

```typescript
{
  type: 'hidden',
}
```

**IMPORTANT:** Do not render `DynamicFormField` for hidden fields. They are automatically included in form submission.

### Custom

Custom field components for specialized inputs.

```typescript
{
  type: 'custom',
  label: 'Custom Field',
  // Custom rendering logic required
}
```

## Hidden Fields

**DO NOT render `DynamicFormField` components for hidden fields.** Hidden fields should only be defined in the form config but not rendered in the form component.

### Why?

Hidden fields are meant to pass metadata (like IDs) through the form without displaying them to the user. The form values are automatically passed to the server action, including hidden fields, even if they're not rendered.

### Example

**❌ WRONG - Don't render hidden fields:**

```typescript
<Form formConfig={formConfig}>
  <div className="space-y-6">
    <DynamicFormField fieldName={fieldNames.taskId} /> {/* Hidden field */}
    <DynamicFormField fieldName={fieldNames.name} />
  </div>
</Form>
```

**✅ CORRECT - Only render visible fields:**

```typescript
<Form formConfig={formConfig}>
  <div className="space-y-6">
    <DynamicFormField fieldName={fieldNames.name} />
    <DynamicFormField fieldName={fieldNames.content} />
    {/* taskId is in form config but not rendered */}
  </div>
</Form>
```

The hidden field values are still included in the form submission through the `defaultValues` in the form config.

## Form State Management

Forms use React Hook Form for state management with the following features:

- **Type Safety**: Full TypeScript support with inferred types
- **Validation**: Zod schema validation
- **Error Handling**: Field-level and form-level errors
- **Loading States**: Automatic pending state during submission
- **Optimistic Updates**: Fast UI feedback

## Server Integration

Forms integrate with Next.js server actions:

1. **Client submits form** → React Hook Form validates with Zod
2. **Validation passes** → Server action called with form data
3. **Server action executes** → Database operations, business logic
4. **Success/Error returned** → UI updates with feedback
5. **Navigation** → Redirect or stay on page

## Best Practices

### 1. Always Define Field Names

Use `createFormFieldNames` for type-safe field access:

```typescript
const fieldNames = createFormFieldNames(fields);
```

### 2. Use Type-Safe Schemas

Infer TypeScript types from Zod schemas:

```typescript
export type CreateXInput = z.infer<typeof createXSchema>;
```

### 3. Provide Clear Error Messages

Customize error messages for better UX:

```typescript
z.string().min(1, "This field is required")
```

### 4. Show Loading States

Always disable buttons during submission:

```typescript
<Button type="submit" disabled={isPending}>
  {isPending ? 'Submitting...' : 'Submit'}
</Button>
```

### 5. Handle Success and Error

Provide feedback for both success and error states:

```typescript
useErrorAction: () => (state) => {
  toast.error(state?.error || 'Operation failed');
},
useSuccessAction: () => (state) => {
  toast.success(state?.message || 'Success!');
  router.push('/next-page');
},
```

## Examples

See existing form implementations:

- `src/features/projects/components/forms/create-project-form/`
- `src/features/tasks/components/forms/create-task-form/`
- `src/features/subtasks/components/forms/generic-subtask/`
