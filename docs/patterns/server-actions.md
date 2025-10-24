# Server Actions Pattern

## Overview

Server actions handle form submissions and mutations in Context Forge using Next.js 15 server actions pattern.

## Action Structure

Server actions follow a consistent pattern:

```typescript
export async function createEntityAction(
  state: EntityFormState,
  data: CreateEntityInput,
): Promise<EntityFormState>;
```

**Parameters:**

- `state` - Previous form state (for optimistic updates)
- `data` - Form data (validated by Zod)

**Returns:** Form state with error or success message

## Form State Type

```typescript
export type EntityFormState = {
  error: string | null;
  message: string | null;
} | null;
```

## Key Operations

### Revalidation

Use `revalidatePath()` to update cached data after mutations:

- Revalidate the list page (e.g., `/projects`)
- Revalidate the detail page (e.g., `/projects/[id]`)
- Revalidate parent pages when appropriate

### Redirection

Use `redirect()` to navigate after successful operations.

**IMPORTANT:** `redirect()` throws an error to break execution, so call it outside `try-catch` blocks or at the very end.

## Error Handling

- Catch errors in try-catch blocks
- Return user-friendly error messages (not technical details)
- Log errors for debugging
- Use type-safe error handling

## Validation

Input validation happens at two levels:

1. **Client-side**: Form validates with Zod schema
2. **Server-side**: Action can re-validate if needed

## Best Practices

1. **Always revalidate** after mutations
2. **Use specific paths** for revalidation, not wildcards
3. **Return user-friendly errors**
4. **Redirect after success**
5. **Use type-safe inputs** from Zod schemas
6. **Call redirect outside try-catch** to avoid catching it

## Action Files

- `src/lib/actions/project-actions.ts`
- `src/lib/actions/task-actions.ts`
- `src/lib/actions/subtask-actions.ts`
