# Server Actions Pattern

## Overview

Server actions handle form submissions and mutations in Context Forge using Next.js 15 server actions pattern.

## Action Structure

```typescript
export type EntityFormState = {
  error: string | null;
  message: string | null;
} | null;

export async function createEntityAction(
  state: EntityFormState,
  data: CreateEntityInput
): Promise<EntityFormState> {
  try {
    const entity = await EntityService.create(data);
    revalidatePath('/relevant-path');
    redirect(`/redirect-path/${entity.id}`);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to create entity',
      message: null,
    };
  }
}
```

## Action Files

- `src/lib/actions/project-actions.ts`
- `src/lib/actions/task-actions.ts`
- `src/lib/actions/subtask-actions.ts`

## Key Components

### Form State Type

Defines the return type for server actions:

```typescript
export type EntityFormState = {
  error: string | null;
  message: string | null;
} | null;
```

**Properties:**
- `error`: Error message if action fails
- `message`: Success message if action succeeds
- `null`: Initial state before submission

### Action Parameters

Server actions receive two parameters:

```typescript
async function action(
  state: EntityFormState,    // Previous state (for optimistic updates)
  data: CreateEntityInput    // Form data (validated by Zod)
): Promise<EntityFormState>
```

### Revalidation

Use `revalidatePath()` to update cached data:

```typescript
import { revalidatePath } from 'next/cache';

revalidatePath('/projects');
revalidatePath(`/projects/${projectId}`);
```

**When to revalidate:**
- After creating an entity
- After updating an entity
- After deleting an entity
- For parent pages that display the entity

### Redirection

Use `redirect()` to navigate after success:

```typescript
import { redirect } from 'next/navigation';

redirect(`/projects/${project.id}`);
```

**Note:** `redirect()` throws an error to break execution, so it should be called outside `try-catch` blocks or at the end.

## Error Handling

### Try-Catch Pattern

```typescript
export async function createEntityAction(
  state: EntityFormState,
  data: CreateEntityInput
): Promise<EntityFormState> {
  try {
    const entity = await EntityService.create(data);
    revalidatePath('/entities');
    redirect(`/entities/${entity.id}`);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to create entity',
      message: null,
    };
  }
}
```

### Error Types

Handle different error scenarios:

```typescript
try {
  // ... operation
} catch (error) {
  if (error instanceof ValidationError) {
    return { error: 'Invalid input data', message: null };
  }
  if (error instanceof DatabaseError) {
    return { error: 'Database operation failed', message: null };
  }
  return {
    error: error instanceof Error ? error.message : 'Unknown error',
    message: null,
  };
}
```

## Example Actions

### Create Action

```typescript
export async function createProjectAction(
  state: ProjectFormState,
  data: CreateProjectInput
): Promise<ProjectFormState> {
  try {
    const project = await ProjectService.create(data);
    revalidatePath('/projects');
    redirect(`/projects/${project.id}`);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to create project',
      message: null,
    };
  }
}
```

### Update Action

```typescript
export async function updateTaskAction(
  state: TaskFormState,
  data: UpdateTaskInput
): Promise<TaskFormState> {
  try {
    const { id, ...updateData } = data;
    const task = await TaskService.update(id, updateData);

    revalidatePath(`/projects/${task.projectId}`);
    revalidatePath(`/projects/${task.projectId}/tasks/${task.id}`);

    redirect(`/projects/${task.projectId}/tasks/${task.id}`);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update task',
      message: null,
    };
  }
}
```

### Delete Action

```typescript
export async function deleteSubtaskAction(
  subtaskId: string
): Promise<void> {
  try {
    const subtask = await SubtaskService.getById(subtaskId);
    if (!subtask) {
      throw new Error('Subtask not found');
    }

    await SubtaskService.delete(subtaskId);

    const task = await TaskService.getById(subtask.taskId);
    if (!task) {
      throw new Error('Parent task not found');
    }

    revalidatePath(`/projects/${task.projectId}/tasks/${task.id}`);
    redirect(`/projects/${task.projectId}/tasks/${task.id}`);
  } catch (error) {
    throw error; // Let Next.js error boundary handle it
  }
}
```

## Validation

### Input Validation

Validation happens at the form level (client-side) and in the action (server-side):

```typescript
export async function createEntityAction(
  state: EntityFormState,
  data: CreateEntityInput  // Already validated by Zod in form config
): Promise<EntityFormState> {
  // Additional server-side validation if needed
  const validated = createEntitySchema.parse(data);

  try {
    const entity = await EntityService.create(validated);
    // ... rest of action
  } catch (error) {
    // ... error handling
  }
}
```

### Business Logic Validation

Validate business rules in the action:

```typescript
export async function createTaskAction(
  state: TaskFormState,
  data: CreateTaskInput
): Promise<TaskFormState> {
  try {
    // Check if project exists
    const projectExists = await ProjectService.projectExists(data.projectId);
    if (!projectExists) {
      return {
        error: 'Project not found',
        message: null,
      };
    }

    const task = await TaskService.create(data);
    revalidatePath(`/projects/${data.projectId}`);
    redirect(`/projects/${data.projectId}/tasks/${task.id}`);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to create task',
      message: null,
    };
  }
}
```

## Best Practices

### 1. Always Revalidate

Update cache after mutations:

```typescript
revalidatePath('/entities');
revalidatePath(`/entities/${entity.id}`);
```

### 2. Use Specific Paths

Revalidate specific paths, not wildcards:

```typescript
// ✅ Good - specific path
revalidatePath(`/projects/${projectId}`);

// ❌ Bad - too broad
revalidatePath('/projects/*');
```

### 3. Return User-Friendly Errors

Provide clear error messages:

```typescript
return {
  error: 'Project name must be unique',
  message: null,
};
```

### 4. Redirect After Success

Always redirect after successful mutations:

```typescript
redirect(`/projects/${project.id}`);
```

### 5. Use Type-Safe Inputs

Leverage Zod-inferred types:

```typescript
async function action(
  state: FormState,
  data: CreateEntityInput  // Inferred from Zod schema
): Promise<FormState>
```

## Server Action Limitations

### Cannot Return Complex Objects

Server actions can only return JSON-serializable data:

```typescript
// ✅ Good
return { error: 'Error message', message: null };

// ❌ Bad
return new Error('Error message');
```

### Redirect Throws

`redirect()` throws an error to break execution:

```typescript
// ✅ Good - redirect outside try-catch
try {
  const entity = await EntityService.create(data);
  revalidatePath('/entities');
} catch (error) {
  return { error: 'Failed', message: null };
}
redirect(`/entities/${entity.id}`);

// ❌ Bad - redirect caught by catch block
try {
  const entity = await EntityService.create(data);
  redirect(`/entities/${entity.id}`);
} catch (error) {
  return { error: 'Failed', message: null };
}
```
