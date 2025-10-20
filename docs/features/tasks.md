# Task Management

## Overview

Tasks belong to projects and contain a shared context that all subtasks can access. Tasks serve as organizational units for related work items.

## Pages

### Create Task

**Route:** `/projects/[projectId]/tasks/new`

Form to create a new task with:
- Name (required)
- Shared context (markdown, required)

### Task Detail

**Route:** `/projects/[projectId]/tasks/[taskId]`

Shows task details and lists all subtasks:
- Task name
- Shared context (rendered markdown)
- List of subtasks
- Button to create new subtask
- Navigation breadcrumbs

## Features

### Shared Context

Tasks have a `sharedContext` field that provides common information to all subtasks.

**Use Cases:**
- Requirements shared across subtasks
- Background information
- Constraints and guidelines
- Reference documentation

**Format:** Markdown

### Create Task

Create tasks within a project with name and shared context.

**Fields:**
- Name (required, min 1 character)
- Shared context (required, markdown)
- Project ID (hidden, passed from route)

### View Task

View task details and all associated subtasks.

**Displays:**
- Task metadata
- Rendered shared context
- Subtask list
- Quick actions

### Ordering

Tasks maintain an `order` field for consistent display. (Future: drag-and-drop reordering)

## Implementation Files

### Service Layer

**File:** `src/lib/services/task-service.ts`

```typescript
export class TaskService {
  static async getAll()
  static async getById(id: string)
  static async getByProjectId(projectId: string)
  static async create(data: CreateTaskInput)
  static async update(id: string, data: UpdateTaskInput)
  static async delete(id: string)
  static async taskExists(id: string): Promise<boolean>
}
```

### Server Actions

**File:** `src/lib/actions/task-actions.ts`

```typescript
export async function createTaskAction(
  state: TaskFormState,
  data: CreateTaskInput
): Promise<TaskFormState>

export async function updateTaskAction(
  state: TaskFormState,
  data: UpdateTaskInput
): Promise<TaskFormState>
```

### Validation Schema

**File:** `src/lib/validations/task-schema.ts`

```typescript
export const createTaskSchema = z.object({
  projectId: z.string().cuid(),
  name: z.string().min(1, "Name is required"),
  sharedContext: z.string().min(1, "Shared context is required"),
});
```

### Form Components

**Directory:** `src/features/tasks/components/forms/`

- `create-task-form-config.tsx` - Form configuration
- `create-task-form.tsx` - Form component

## Related Entities

- **Project**: Each task belongs to one project
- **Subtasks**: Each task can have multiple subtasks

## Cascading Deletes

When a task is deleted, all associated subtasks are automatically deleted.

```
DELETE Task → CASCADE → DELETE Subtasks
```

## Markdown Support

Both the form and display support GitHub-flavored markdown:
- Headers
- Lists
- Code blocks
- Links
- Emphasis (bold, italic)
- And more
