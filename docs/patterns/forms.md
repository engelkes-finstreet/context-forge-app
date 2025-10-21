# Form Pattern

## Overview

All forms in Context Forge follow a consistent pattern based on React Hook Form and Zod validation.

## Form Structure

Forms are organized into two files:

```
src/features/{feature}/components/forms/{form-name}/
├── {form-name}-form-config.tsx   # Configuration hook
└── {form-name}-form.tsx          # Form component
```

## Pattern Components

### 1. Form Configuration Hook

Located in `*-form-config.tsx`, this hook defines:
- **Field definitions** (types, labels, validation rules)
- **Default values**
- **Zod schema** for validation
- **Server action** for submission
- **Success/error handlers**
- **Form buttons** (submit, cancel, etc.)

### 2. Form Component

Located in `*-form.tsx`, this component:
- Uses the configuration hook
- Renders form fields with `<DynamicFormField>`
- Wraps fields in `<Form>` component

## Key Concepts

### Hidden Fields

**IMPORTANT:** Do not render `DynamicFormField` for hidden fields. Hidden fields should only be defined in the form config but not rendered. They are automatically included in form submission through `defaultValues`.

**Example:**
```typescript
// Config defines hidden field
fields: {
  taskId: { type: 'hidden' },  // Define but don't render
  name: { type: 'input', label: 'Name' }  // This gets rendered
}

// Component only renders visible fields
<DynamicFormField fieldName={fieldNames.name} />
// taskId is NOT rendered but still submitted
```

### Type Safety

- Use `createFormFieldNames()` for type-safe field access
- Infer types from Zod schemas with `z.infer<typeof schema>`
- All form data is validated before reaching server actions

### State Management

Forms use:
- **React Hook Form** for client-side state
- **Zod** for validation
- **Server Actions** for submission
- **useFormState** for server-side error handling

## Supported Field Types

- **input** - Text inputs (text, email, number, url, etc.)
- **textarea** - Multi-line text
- **password** - Password field with masking
- **hidden** - Hidden metadata fields (don't render!)
- **custom** - Custom field components

## Examples

See existing implementations in:
- `src/features/projects/components/forms/create-project-form/`
- `src/features/tasks/components/forms/create-task-form/`
- `src/features/subtasks/components/forms/generic-subtask/`
