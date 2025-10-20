# Project Management

## Overview

Projects are the top-level organizational unit in Context Forge. Each project can contain multiple tasks.

## Pages

### List Projects

**Route:** `/projects`

Displays all projects with:
- Project name
- Description (if provided)
- Task count
- Creation date

### Create Project

**Route:** `/projects/new`

Form to create a new project with:
- Name (required)
- Description (optional)

### Project Detail

**Route:** `/projects/[projectId]`

Shows project details and lists all tasks:
- Project name and description
- List of tasks with subtask counts
- Button to create new task
- Navigation back to projects list

## Features

### Create Project

Users can create projects with a name and optional description.

**Fields:**
- Name (required, min 1 character)
- Description (optional)

### View Project

View project details and all associated tasks.

**Displays:**
- Project metadata
- Task list
- Subtask counts per task

### List Projects

Browse all projects with quick overview.

**Shows:**
- Project names
- Descriptions
- Task counts
- Quick access links

## Implementation Files

### Service Layer

**File:** `src/lib/services/project-service.ts`

```typescript
export class ProjectService {
  static async getAll()
  static async getById(id: string)
  static async create(data: CreateProjectInput)
  static async update(id: string, data: UpdateProjectInput)
  static async delete(id: string)
  static async projectExists(id: string): Promise<boolean>
}
```

### Server Actions

**File:** `src/lib/actions/project-actions.ts`

```typescript
export async function createProjectAction(
  state: ProjectFormState,
  data: CreateProjectInput
): Promise<ProjectFormState>
```

### Validation Schema

**File:** `src/lib/validations/project-schema.ts`

```typescript
export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});
```

### Form Components

**Directory:** `src/features/projects/components/forms/`

- `create-project-form-config.tsx` - Form configuration
- `create-project-form.tsx` - Form component

## Related Entities

- **Tasks**: Projects have many tasks
- **Subtasks**: Tasks have many subtasks (indirect relation)

## Cascading Deletes

When a project is deleted, all associated tasks and subtasks are automatically deleted.

```
DELETE Project → CASCADE → DELETE Tasks → CASCADE → DELETE Subtasks
```
