# Subtask Management

## Overview

Subtasks are individual work items within a task. Each subtask has access to its parent task's shared context and maintains its own content.

## Pages

### Create Subtask

**Route:** `/projects/[projectId]/tasks/[taskId]/subtasks/new`

Type selection page that allows choosing subtask type:
- Generic (standard subtask)
- Form (planned)
- Modal (planned)
- Inquiry Process (planned)

### Edit Subtask

**Route:** `/projects/[projectId]/tasks/[taskId]/subtasks/[subtaskId]/edit`

Form to edit an existing subtask with:
- Name (editable)
- Content (editable, markdown)
- Type (readonly, displayed as badge)
- Shared context (readonly, displayed for reference)

## Features

### Content Management

Subtasks have their own markdown content separate from the shared context.

**Fields:**
- Name (required, min 1 character)
- Content (required, markdown)
- Task ID (hidden, passed from route)

### Shared Context Access

While editing or viewing a subtask, the parent task's shared context is displayed for reference.

**Display:**
- Rendered markdown in a separate section
- Clearly labeled as "Shared Context (from parent task)"
- Read-only

### Type System

Subtasks support different types with specialized behavior:
- **GENERIC**: Standard subtask with name and content
- **FORM**: Form-based subtask (planned)
- **MODAL**: Modal dialog subtask (planned)
- **INQUIRY_PROCESS**: Multi-step wizard (planned)

See [Typed Subtasks](./typed-subtasks.md) for detailed documentation.

### Type Immutability

Once created, a subtask's type **cannot be changed**. The edit form displays the type as a readonly badge.

**Rationale:**
- Ensures metadata always matches the type
- Prevents invalid state combinations
- Simplifies migration logic
- Sets clear user expectations

## Implementation Files

### Service Layer

**File:** `src/lib/services/subtask-service.ts`

```typescript
export class SubtaskService {
  static async getAll()
  static async getById(id: string)
  static async getByTaskId(taskId: string)
  static async create(data: CreateSubtaskInput)
  static async update(id: string, data: UpdateSubtaskInput)
  static async delete(id: string)
  static async subtaskExists(id: string): Promise<boolean>
}
```

### Server Actions

**File:** `src/lib/actions/subtask-actions.ts`

```typescript
export async function createGenericSubtaskAction(
  state: SubtaskFormState,
  data: CreateGenericSubtaskFormInput
): Promise<SubtaskFormState>

export async function updateSubtaskAction(
  state: SubtaskFormState,
  data: UpdateSubtaskInput
): Promise<SubtaskFormState>

export async function deleteSubtaskAction(
  subtaskId: string
): Promise<void>
```

### Validation Schema

**File:** `src/lib/validations/subtask-schema.ts` (database schema)
**File:** `src/lib/validations/forms/generic-subtask-form-schema.ts` (form schema)

```typescript
// Database schema
export const createSubtaskSchema = z.object({
  taskId: z.string().cuid(),
  name: z.string().min(1, "Name is required"),
  type: z.enum([...]),
  content: z.string().min(1, "Content is required"),
  metadata: z.union([...]),
});

// Generic form schema
export const createGenericSubtaskFormSchema = z.object({
  taskId: z.string().cuid(),
  name: z.string().min(1, "Name is required"),
  content: z.string().min(1, "Content is required"),
});
```

### Form Components

**Directory:** `src/features/subtasks/components/forms/generic-subtask/`

- `generic-subtask-form-config.tsx` - Form configuration
- `generic-subtask-form.tsx` - Form component

**Directory:** `src/features/subtasks/components/type-selector/`

- `type-selector.tsx` - Type selection interface
- `type-card.tsx` - Individual type card

## Related Entities

- **Task**: Each subtask belongs to one task
- **Project**: Indirect relation through task

## MCP Integration

Subtasks can be accessed and modified through the MCP server.

**Resource URI:**
```
context-forge://project/{projectId}/task/{taskId}/subtask/{subtaskId}
```

**Content Format:**
```markdown
# {Subtask Name}

## Shared Context (from parent task)

{Task's sharedContext field}

## Content

{Subtask's content field}
```

See [MCP Server Integration](../integrations/mcp-server.md) for details.

## Markdown Support

Both the form and display support GitHub-flavored markdown:
- Headers
- Lists
- Code blocks
- Links
- Emphasis (bold, italic)
- And more
