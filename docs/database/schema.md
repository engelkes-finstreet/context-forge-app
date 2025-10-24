# Database Schema

## Overview

Context Forge uses PostgreSQL with Prisma ORM. The full schema is defined in `prisma/schema.prisma`.

## Entity Relationships

```
Project (1) ──────< Task (n)
                     │
                     └──────< Subtask (n)
```

**Hierarchy:**

- Each **Project** can have multiple **Tasks**
- Each **Task** belongs to one **Project** and can have multiple **Subtasks**
- Each **Subtask** belongs to one **Task**

## Key Concepts

### Shared Context

Tasks include a `sharedContext` field (markdown) that provides common information accessible to all subtasks within that task. This avoids duplicating context across subtasks.

**Use Case:** Define requirements, constraints, or background information once at the task level, rather than repeating it in each subtask.

### Cascading Deletes

The schema uses cascading deletes to maintain referential integrity:

- Deleting a **Project** → automatically deletes all its **Tasks** and **Subtasks**
- Deleting a **Task** → automatically deletes all its **Subtasks**

### Ordering

Both Tasks and Subtasks include an `order` field to maintain consistent display ordering across the application.

### Typed Subtasks

Subtasks support different types (GENERIC, FORM, MODAL, INQUIRY_PROCESS) with optional type-specific metadata stored as JSON. See [Typed Subtasks](../features/typed-subtasks.md) for details.

### Automatic Timestamps

All entities automatically track when they were created and last modified with `createdAt` and `updatedAt` fields.

## Schema Location

**File:** `prisma/schema.prisma`

For migration and setup information, see [Database Setup](./setup.md).
