# Typed Subtask System

## Overview

Context Forge implements a **two-layer validation system** that separates user input (forms) from database input (Prisma). This architecture enables type-specific forms with different fields while maintaining type safety throughout the application.

## Core Principles

1. **Form Schemas** define what users input (type-specific fields)
2. **Database Schemas** define what gets stored in the database
3. **Server Actions** transform form data → database data
4. **Type System** ensures compile-time safety with discriminated unions

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Input Layer                     │
│         (Form Schemas - Type-Specific Fields)           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Generic Form Schema          Form Type Schema         │
│  - taskId                     - taskId                  │
│  - name                       - name                    │
│  - content (user writes)      - fields[] (config)       │
│                               - submitEndpoint          │
│                               - submitButtonText        │
│                                                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Server Action       │
         │   Transformation      │
         │                       │
         │  1. Validate form     │
         │  2. Build metadata    │
         │  3. Add type field    │
         │  4. Generate content* │
         │  5. Create DB input   │
         └───────────┬───────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Database Input Layer                    │
│              (Prisma Schema - Unified)                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  CreateSubtaskInput (all types)                         │
│  - taskId: string                                       │
│  - name: string                                         │
│  - type: SubtaskType (GENERIC | FORM | MODAL | ...)    │
│  - content: string                                      │
│  - metadata: SubtaskMetadata (type-specific JSON)       │
│                                                         │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
              [Prisma ORM]
                     │
                     ▼
            [PostgreSQL Database]

* Future enhancement for non-Generic types
```

## Subtask Types

Currently supported subtask types:

| Type | Status | Description | Metadata |
|------|--------|-------------|----------|
| `GENERIC` | ✅ Implemented | Standard subtask with name & content | `null` |
| `INQUIRY_PROCESS` | 🔄 Planned | Multi-step form wizard | Steps, progress config |
| `FORM` | 🔄 Planned | Single form with field definitions | Fields, validation, endpoint |
| `MODAL` | 🔄 Planned | Modal dialog component | Size, trigger, close behavior |

## Example: Generic Type Flow

### 1. User fills form (Form Schema)

```typescript
// Type: CreateGenericSubtaskFormInput
{
  taskId: "cm123...",
  name: "Implement login",
  content: "Create login form with email/password..."
}
```

### 2. Server action transforms (Type-Specific Action)

```typescript
// createGenericSubtaskAction
const subtaskInput: CreateSubtaskInput = {
  ...formData,                    // taskId, name, content
  type: SubtaskType.GENERIC,      // Added by action
  metadata: null,                 // Generic has no metadata
};
```

### 3. Database stores (Database Schema)

```typescript
// Prisma creates record
{
  id: "cm456...",
  taskId: "cm123...",
  name: "Implement login",
  type: "GENERIC",
  content: "Create login form with email/password...",
  metadata: null,
  order: 0,
  createdAt: "2025-01-20T...",
  updatedAt: "2025-01-20T..."
}
```

## Type-Specific Metadata (Future)

When implementing new subtask types, metadata stores type-specific configuration.

### Example: Form Type

**Form Schema (what user inputs):**

```typescript
{
  taskId: "cm123...",
  name: "User Registration Form",
  fields: [
    { name: "email", type: "email", label: "Email", required: true },
    { name: "password", type: "password", label: "Password", required: true }
  ],
  submitEndpoint: "/api/register",
  submitButtonText: "Register"
}
```

**After transformation (what gets stored):**

```typescript
{
  taskId: "cm123...",
  name: "User Registration Form",
  type: "FORM",
  content: "<!-- AI-generated content based on metadata -->",
  metadata: {
    type: "FORM",
    fields: [...],
    submitEndpoint: "/api/register",
    submitButtonText: "Register"
  }
}
```

## File Organization

```
src/
├── lib/validations/
│   ├── subtask-schema.ts                    # Database schemas
│   └── forms/                               # Form schemas (user input)
│       ├── generic-subtask-form-schema.ts
│       ├── form-subtask-form-schema.ts      # (future)
│       ├── modal-subtask-form-schema.ts     # (future)
│       └── inquiry-process-form-schema.ts   # (future)
│
├── lib/actions/
│   └── subtask-actions.ts
│       ├── createGenericSubtaskAction       # Generic type
│       ├── createFormSubtaskAction          # (future)
│       ├── createModalSubtaskAction         # (future)
│       └── createInquiryProcessAction       # (future)
│
├── features/subtasks/
│   ├── types/
│   │   └── subtask-types.ts                 # TypeScript types & metadata
│   ├── config/
│   │   └── type-config.ts                   # UI config (icons, labels, routes)
│   └── components/
│       ├── type-selector/                   # Type selection UI
│       │   ├── type-card.tsx
│       │   └── type-selector.tsx
│       └── forms/
│           ├── generic-subtask/             # Generic form
│           ├── form-subtask/                # (future)
│           ├── modal-subtask/               # (future)
│           └── inquiry-process-subtask/     # (future)
```

## How to Add a New Subtask Type

Follow these steps to implement a new type (e.g., "Form").

### 1. Enable the Type

**File:** `src/features/subtasks/config/type-config.ts`

```typescript
[SubtaskType.FORM]: {
  // ...
  enabled: true,  // Change from false to true
}
```

### 2. Create Form Schema

**File:** `src/lib/validations/forms/form-subtask-form-schema.ts`

```typescript
export const createFormSubtaskFormSchema = z.object({
  taskId: z.string().cuid(),
  name: z.string().min(1),

  // Type-specific fields
  fields: z.array(z.object({
    name: z.string(),
    type: z.enum(['text', 'email', 'password', ...]),
    label: z.string(),
    required: z.boolean().optional(),
  })).min(1),

  submitEndpoint: z.string().url().optional(),
  submitButtonText: z.string().default("Submit"),
});

export type CreateFormSubtaskFormInput = z.infer<typeof createFormSubtaskFormSchema>;
```

### 3. Create Server Action

**File:** `src/lib/actions/subtask-actions.ts`

```typescript
export async function createFormSubtaskAction(
  state: SubtaskFormState,
  formData: CreateFormSubtaskFormInput
): Promise<SubtaskFormState> {
  try {
    // Build metadata from form fields
    const metadata: FormMetadata = {
      type: SubtaskType.FORM,
      fields: formData.fields,
      submitEndpoint: formData.submitEndpoint,
      submitButtonText: formData.submitButtonText,
    };

    // Optional: Generate content via AI
    const content = formData.content || await generateContent(metadata);

    // Transform to database input
    const subtaskInput: CreateSubtaskInput = {
      taskId: formData.taskId,
      name: formData.name,
      type: SubtaskType.FORM,
      content,
      metadata,
    };

    const subtask = await SubtaskService.createSubtask(subtaskInput);
    // ... revalidate and redirect
  } catch (error) {
    // ... error handling
  }
}
```

### 4. Create Form Components

**File:** `src/features/subtasks/components/forms/form-subtask/form-subtask-form-config.tsx`

```typescript
export function useCreateFormSubtaskFormConfig(taskId: string) {
  const defaultValues: DeepPartial<CreateFormSubtaskFormInput> = {
    taskId,
    name: '',
    fields: [],
    submitButtonText: 'Submit',
  };

  const fields: FormFieldsType<CreateFormSubtaskFormInput> = {
    taskId: { type: 'hidden' },
    name: {
      type: 'input',
      label: 'Form Name',
    },
    fields: {
      type: 'custom',  // Array field for form fields
      label: 'Form Fields',
    },
    // ... other fields
  };

  return {
    fields,
    defaultValues,
    schema: createFormSubtaskFormSchema,  // ← Form schema, not DB schema
    serverAction: createFormSubtaskAction, // ← Type-specific action
    // ...
  };
}
```

**File:** `src/features/subtasks/components/forms/form-subtask/form-subtask-form.tsx`

```typescript
export function CreateFormSubtaskForm({ taskId }: { taskId: string }) {
  const formConfig = useCreateFormSubtaskFormConfig(taskId);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <div className="space-y-6">
        <DynamicFormField fieldName={fieldNames.name} />
        <FormFieldsArrayEditor fieldName={fieldNames.fields} />
        <DynamicFormField fieldName={fieldNames.submitEndpoint} />
        <DynamicFormField fieldName={fieldNames.submitButtonText} />
      </div>
    </Form>
  );
}
```

### 5. Create Route

**File:** `src/app/(authenticated)/projects/[projectId]/tasks/[taskId]/subtasks/new/form/page.tsx`

```typescript
import { CreateFormSubtaskForm } from '@/features/subtasks/components/forms/form-subtask/form-subtask-form';

export default async function NewFormSubtaskPage({ params }: PageProps) {
  const { projectId, taskId } = await params;
  // ... validation

  return (
    <div>
      <h1>Create Form Subtask</h1>
      <CreateFormSubtaskForm taskId={taskId} />
    </div>
  );
}
```

## Key Benefits

✅ **Separation of Concerns**: Form validation ≠ Database validation
✅ **Type Safety**: Compile-time checks prevent invalid metadata
✅ **Extensibility**: Easy to add new types without breaking existing ones
✅ **Flexibility**: Each type has custom form fields tailored to its needs
✅ **Clean Architecture**: Clear data flow from user → form → action → database
✅ **Future-Proof**: Ready for AI content generation or other transformations

## Type Immutability

Once created, a subtask's type **cannot be changed**. This ensures:
- Metadata always matches the type
- No invalid state combinations
- Simpler migration logic
- Clearer user expectations

The edit form displays the type as a readonly badge to reinforce this constraint.
