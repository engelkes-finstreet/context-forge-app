# Task Management

## Overview

Tasks belong to projects and contain a shared context that all subtasks can access. Tasks serve as organizational units for related work items.

## Key Features

- **Create tasks** with name and shared context (markdown)
- **Shared context** accessible by all subtasks to avoid duplication
- **View task details** showing shared context and all subtasks
- **Edit tasks** to update name or shared context
- **Delete tasks** (automatically cascades to all subtasks)
- **Markdown support** for rich formatted shared context

## Routes

- `/projects/[projectId]/tasks/new` - Create new task
- `/projects/[projectId]/tasks/[taskId]` - View task details and subtasks
- `/projects/[projectId]/tasks/[taskId]/edit` - Edit task

## Shared Context Concept

The `sharedContext` field stores markdown content that provides common information to all subtasks within a task.

**Use Cases:**

- Requirements shared across subtasks
- Background information
- Constraints and guidelines
- Reference documentation

**Why?** Avoids duplicating context across multiple subtasks. Define it once at the task level, and all subtasks can access it.

## Related Entities

- **Project**: Each task belongs to one project (many-to-one)
- **Subtasks**: Each task can have multiple subtasks (one-to-many)

## Implementation

**Service:** `src/lib/services/task-service.ts`
**Actions:** `src/lib/actions/task-actions.ts`
**Validation:** `src/lib/validations/task-schema.ts`
**Forms:** `src/features/tasks/components/forms/`
