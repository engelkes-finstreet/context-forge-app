# Subtask Management

## Overview

Subtasks are individual work items within a task. Each subtask has access to its parent task's shared context and maintains its own content.

## Key Features

- **Create subtasks** with name and content (markdown)
- **Access shared context** from parent task while editing
- **Edit subtasks** to update name or content
- **Delete subtasks**
- **Type system** for specialized subtask behaviors
- **Type immutability** - type cannot be changed after creation
- **Markdown support** for rich formatted content

## Routes

- `/projects/[projectId]/tasks/[taskId]/subtasks/new` - Select subtask type
- `/projects/[projectId]/tasks/[taskId]/subtasks/new/generic` - Create generic subtask
- `/projects/[projectId]/tasks/[taskId]/subtasks/[subtaskId]/edit` - Edit subtask

## Subtask Types

Subtasks support different types with specialized behavior:

- **GENERIC**: Standard subtask with name and content (implemented)
- **FORM**: Form-based subtask (planned)
- **MODAL**: Modal dialog subtask (planned)
- **INQUIRY_PROCESS**: Multi-step wizard (planned)

See [Typed Subtasks](./typed-subtasks.md) for details.

## Type Immutability

Once created, a subtask's type **cannot be changed**. This ensures metadata always matches the type and prevents invalid state combinations.

## Shared Context Access

While editing a subtask, the parent task's shared context is displayed for reference (read-only). This provides necessary context without duplicating it in the subtask content.

## MCP Integration

Subtasks are accessible through the MCP server for programmatic access by Claude Code.

**Resource URI:** `context-forge://project/{projectId}/task/{taskId}/subtask/{subtaskId}`

See [MCP Server](../integrations/mcp-server.md) for API details.

## Related Entities

- **Task**: Each subtask belongs to one task (many-to-one)
- **Project**: Indirectly related through task

## Implementation

**Service:** `src/lib/services/subtask-service.ts`
**Actions:** `src/lib/actions/subtask-actions.ts`
**Validation:** `src/lib/validations/subtask-schema.ts` (database) and `src/lib/validations/forms/` (form schemas)
**Forms:** `src/features/subtasks/components/forms/`
**Type Config:** `src/features/subtasks/config/type-config.ts`
