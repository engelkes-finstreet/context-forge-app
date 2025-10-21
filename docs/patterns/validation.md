# Validation Schemas

## Overview

All input validation in Context Forge uses Zod schemas for type-safe validation at both client and server levels.

## Schema Structure

```typescript
export const createEntitySchema = z.object({
  field: z.string().min(1, "Field is required"),
  optionalField: z.string().optional(),
});

export type CreateEntityInput = z.infer<typeof createEntitySchema>;
```

## Schema Files

- `src/lib/validations/project-schema.ts`
- `src/lib/validations/task-schema.ts`
- `src/lib/validations/subtask-schema.ts`
- `src/lib/validations/forms/` - Form-specific schemas (for typed subtasks)

## Basic Schema Types

### String Validation

```typescript
z.string()                                    // Basic string
z.string().min(1, "Required")                 // Non-empty string
z.string().min(3, "At least 3 characters")    // Minimum length
z.string().max(100, "Too long")               // Maximum length
z.string().email("Invalid email")             // Email format
z.string().url("Invalid URL")                 // URL format
z.string().cuid("Invalid ID")                 // CUID format
```

### Number Validation

```typescript
z.number()                                    // Basic number
z.number().int("Must be integer")             // Integer only
z.number().min(0, "Must be positive")         // Minimum value
z.number().max(100, "Too large")              // Maximum value
```

### Boolean Validation

```typescript
z.boolean()                                   // Boolean
z.boolean().default(false)                    // With default
```

### Optional Fields

```typescript
z.string().optional()                         // Can be undefined
z.string().nullable()                         // Can be null
z.string().nullish()                          // Can be null or undefined
```

### Default Values

```typescript
z.string().default("default value")
z.number().default(0)
z.boolean().default(false)
```

## Complex Schema Types

### Objects

```typescript
const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  zipCode: z.string(),
});
```

### Arrays

```typescript
const tagsSchema = z.array(z.string()).min(1, "At least one tag required");

const itemsSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
}));
```

### Enums

```typescript
const statusSchema = z.enum(['pending', 'active', 'completed']);

// Or with const array
const STATUSES = ['pending', 'active', 'completed'] as const;
const statusSchema = z.enum(STATUSES);
```

### Unions

```typescript
const idSchema = z.union([
  z.string().cuid(),
  z.string().uuid(),
]);
```

### Discriminated Unions

```typescript
const subtaskMetadataSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('GENERIC'),
    // No additional fields
  }),
  z.object({
    type: z.literal('FORM'),
    fields: z.array(/* ... */),
    submitEndpoint: z.string().url(),
  }),
]);
```

## Type Inference

Use `z.infer` to extract TypeScript types:

```typescript
export const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
// Type: { name: string; description?: string | undefined }
```

## Example Schemas

### Project Schema

```typescript
import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
});

export const updateProjectSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, "Project name is required").optional(),
  description: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
```

### Task Schema

```typescript
import { z } from 'zod';

export const createTaskSchema = z.object({
  projectId: z.string().cuid(),
  name: z.string().min(1, "Task name is required"),
  sharedContext: z.string().min(1, "Shared context is required"),
});

export const updateTaskSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, "Task name is required").optional(),
  sharedContext: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
```

### Subtask Schema (Database)

```typescript
import { z } from 'zod';

export const subtaskTypeSchema = z.enum([
  'GENERIC',
  'FORM',
  'MODAL',
  'INQUIRY_PROCESS',
]);

export const createSubtaskSchema = z.object({
  taskId: z.string().cuid(),
  name: z.string().min(1, "Subtask name is required"),
  type: subtaskTypeSchema,
  content: z.string().min(1, "Content is required"),
  metadata: z.union([/* type-specific schemas */]).nullable(),
});

export type SubtaskType = z.infer<typeof subtaskTypeSchema>;
export type CreateSubtaskInput = z.infer<typeof createSubtaskSchema>;
```

### Form Schema (User Input)

```typescript
import { z } from 'zod';

export const createGenericSubtaskFormSchema = z.object({
  taskId: z.string().cuid(),
  name: z.string().min(1, "Subtask name is required"),
  content: z.string().min(1, "Content is required"),
});

export type CreateGenericSubtaskFormInput = z.infer<typeof createGenericSubtaskFormSchema>;
```

## Schema Composition

### Extending Schemas

```typescript
const baseSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const extendedSchema = baseSchema.extend({
  category: z.string(),
  tags: z.array(z.string()),
});
```

### Picking Fields

```typescript
const fullSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date(),
});

const createSchema = fullSchema.omit({ id: true, createdAt: true });
// Only name and description
```

### Partial Schemas

```typescript
const createSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const updateSchema = createSchema.partial();
// All fields optional: { name?: string; description?: string }
```

## Validation in Forms

Forms automatically validate using the schema:

```typescript
export function useCreateProjectFormConfig() {
  return {
    schema: createProjectSchema,  // Zod schema
    // ... other config
  };
}
```

React Hook Form uses the schema for:
- Client-side validation
- Type inference
- Error messages

## Validation in Server Actions

Server actions should re-validate:

```typescript
export async function createProjectAction(
  state: ProjectFormState,
  data: CreateProjectInput
): Promise<ProjectFormState> {
  // Optional: Re-validate on server
  const validated = createProjectSchema.parse(data);

  try {
    const project = await ProjectService.create(validated);
    // ...
  } catch (error) {
    // ...
  }
}
```

## Custom Validation

### Refinements

Add custom validation logic:

```typescript
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .refine(
    (val) => /[A-Z]/.test(val),
    "Password must contain uppercase letter"
  )
  .refine(
    (val) => /[0-9]/.test(val),
    "Password must contain number"
  );
```

### Superrefine

Complex validation with multiple errors:

```typescript
const schema = z.object({
  password: z.string(),
  confirmPassword: z.string(),
}).superrefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });
  }
});
```

## Best Practices

### 1. Provide Clear Error Messages

```typescript
// ✅ Good - clear error message
z.string().min(1, "Project name is required")

// ❌ Bad - generic error
z.string().min(1)
```

### 2. Use Type Inference

```typescript
// ✅ Good - inferred type
export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// ❌ Bad - manual type (can drift from schema)
export type CreateProjectInput = {
  name: string;
  description?: string;
};
```

### 3. Separate Form and Database Schemas

For typed entities, use separate schemas:

```typescript
// Form schema (what user inputs)
const createFormSubtaskFormSchema = z.object({
  taskId: z.string(),
  name: z.string(),
  fields: z.array(/* ... */),
});

// Database schema (what gets stored)
const createSubtaskSchema = z.object({
  taskId: z.string(),
  name: z.string(),
  type: z.enum([...]),
  content: z.string(),
  metadata: z.object(/* ... */),
});
```

### 4. Reuse Common Schemas

```typescript
const idSchema = z.string().cuid();
const nameSchema = z.string().min(1, "Name is required");

const projectSchema = z.object({
  id: idSchema,
  name: nameSchema,
});
```

### 5. Use Default Values Sparingly

Only use defaults when there's a clear default:

```typescript
// ✅ Good - clear default
z.boolean().default(false)

// ❌ Bad - unclear default
z.string().default("")  // Better to make optional
```
