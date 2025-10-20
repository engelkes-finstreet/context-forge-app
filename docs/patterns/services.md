# Service Layer Pattern

## Overview

All business logic in Context Forge is encapsulated in service classes. Services provide a clean abstraction over database operations and complex business rules.

## Service Structure

```typescript
export class EntityService {
  static async getAll() { /* ... */ }
  static async getById(id: string) { /* ... */ }
  static async create(data: CreateInput) { /* ... */ }
  static async update(id: string, data: UpdateInput) { /* ... */ }
  static async delete(id: string) { /* ... */ }
  static async entityExists(id: string): Promise<boolean> { /* ... */ }
}
```

## Service Files

- `src/lib/services/project-service.ts`
- `src/lib/services/task-service.ts`
- `src/lib/services/subtask-service.ts`

## Key Features

### Static Methods

Services use static methods for simplicity and ease of use:

```typescript
const project = await ProjectService.getById(id);
```

No need to instantiate service classes.

### Type Safety

All methods use TypeScript for type safety:

```typescript
static async create(data: CreateProjectInput): Promise<Project> {
  return await db.project.create({ data });
}
```

### Relation Handling

Services include relations when needed:

```typescript
static async getById(id: string) {
  return await db.project.findUnique({
    where: { id },
    include: {
      tasks: {
        include: {
          _count: {
            select: { subtasks: true }
          }
        },
        orderBy: { order: 'asc' }
      }
    }
  });
}
```

### Ordering and Filtering

Support for ordering and filtering:

```typescript
static async getByProjectId(projectId: string) {
  return await db.task.findMany({
    where: { projectId },
    orderBy: { order: 'asc' }
  });
}
```

## Standard Methods

### getAll()

Retrieve all entities.

```typescript
static async getAll(): Promise<Entity[]> {
  return await db.entity.findMany({
    orderBy: { createdAt: 'desc' }
  });
}
```

### getById(id)

Retrieve a single entity by ID.

```typescript
static async getById(id: string): Promise<Entity | null> {
  return await db.entity.findUnique({
    where: { id }
  });
}
```

### create(data)

Create a new entity.

```typescript
static async create(data: CreateEntityInput): Promise<Entity> {
  return await db.entity.create({
    data
  });
}
```

### update(id, data)

Update an existing entity.

```typescript
static async update(
  id: string,
  data: UpdateEntityInput
): Promise<Entity> {
  return await db.entity.update({
    where: { id },
    data
  });
}
```

### delete(id)

Delete an entity.

```typescript
static async delete(id: string): Promise<Entity> {
  return await db.entity.delete({
    where: { id }
  });
}
```

### entityExists(id)

Check if entity exists.

```typescript
static async entityExists(id: string): Promise<boolean> {
  const count = await db.entity.count({
    where: { id }
  });
  return count > 0;
}
```

## Error Handling

Services should throw meaningful errors:

```typescript
static async getById(id: string): Promise<Entity> {
  const entity = await db.entity.findUnique({
    where: { id }
  });

  if (!entity) {
    throw new Error(`Entity with ID ${id} not found`);
  }

  return entity;
}
```

## Transaction Support

Use transactions for complex operations:

```typescript
static async createWithRelations(data: ComplexInput): Promise<Entity> {
  return await db.$transaction(async (tx) => {
    const entity = await tx.entity.create({ data: data.entity });
    await tx.relatedEntity.createMany({
      data: data.related.map(r => ({ ...r, entityId: entity.id }))
    });
    return entity;
  });
}
```

## Example: ProjectService

```typescript
import { db } from '@/lib/db';
import type { CreateProjectInput, UpdateProjectInput } from '@/lib/validations/project-schema';

export class ProjectService {
  static async getAll() {
    return await db.project.findMany({
      include: {
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getById(id: string) {
    return await db.project.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            _count: {
              select: { subtasks: true }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  static async create(data: CreateProjectInput) {
    return await db.project.create({ data });
  }

  static async update(id: string, data: UpdateProjectInput) {
    return await db.project.update({
      where: { id },
      data
    });
  }

  static async delete(id: string) {
    return await db.project.delete({
      where: { id }
    });
  }

  static async projectExists(id: string): Promise<boolean> {
    const count = await db.project.count({
      where: { id }
    });
    return count > 0;
  }
}
```

## Best Practices

### 1. Keep Services Focused

Each service should manage one entity type:

```typescript
// ✅ Good - focused on projects
export class ProjectService { /* ... */ }

// ❌ Bad - mixing concerns
export class DataService {
  getProjects() { /* ... */ }
  getTasks() { /* ... */ }
}
```

### 2. Use Type-Safe Inputs

Always use validated input types:

```typescript
static async create(data: CreateProjectInput) {
  // data is already validated by Zod
  return await db.project.create({ data });
}
```

### 3. Include Necessary Relations

Only include relations you need:

```typescript
// ✅ Good - only include what's needed
static async getAll() {
  return await db.project.findMany({
    include: { _count: { select: { tasks: true } } }
  });
}

// ❌ Bad - including everything
static async getAll() {
  return await db.project.findMany({
    include: {
      tasks: {
        include: {
          subtasks: true  // Not needed for list view
        }
      }
    }
  });
}
```

### 4. Handle Errors Gracefully

Provide meaningful error messages:

```typescript
static async getById(id: string) {
  const project = await db.project.findUnique({ where: { id } });

  if (!project) {
    throw new Error(`Project with ID ${id} not found`);
  }

  return project;
}
```

### 5. Use Ordering

Provide consistent ordering:

```typescript
static async getAll() {
  return await db.project.findMany({
    orderBy: { createdAt: 'desc' }
  });
}
```
