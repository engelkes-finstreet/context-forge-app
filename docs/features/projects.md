# Project Management

## Overview

Projects are the top-level organizational unit in Context Forge. Each project can contain multiple tasks.

## Key Features

- **Create projects** with name and optional description
- **List all projects** with task counts at a glance
- **View project details** showing all associated tasks
- **Delete projects** (automatically cascades to all tasks and subtasks)

## Routes

- `/projects` - List all projects
- `/projects/new` - Create new project
- `/projects/[projectId]` - View project details and tasks

## Related Entities

- **Tasks**: Projects have many tasks (one-to-many)
- **Subtasks**: Indirectly related through tasks

## Implementation

**Service:** `src/lib/services/project-service.ts`
**Actions:** `src/lib/actions/project-actions.ts`
**Validation:** `src/lib/validations/project-schema.ts`
**Forms:** `src/features/projects/components/forms/`
