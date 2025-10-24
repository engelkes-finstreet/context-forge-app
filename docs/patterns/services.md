# Service Layer Pattern

## Overview

All business logic in Context Forge is encapsulated in service classes. Services provide a clean abstraction over database operations and complex business rules.

## Service Structure

Services use static methods for standard CRUD operations:

```typescript
export class EntityService {
  static async getAll() {
    /* ... */
  }
  static async getById(id: string) {
    /* ... */
  }
  static async create(data: CreateInput) {
    /* ... */
  }
  static async update(id: string, data: UpdateInput) {
    /* ... */
  }
  static async delete(id: string) {
    /* ... */
  }
  static async entityExists(id: string): Promise<boolean> {
    /* ... */
  }
}
```

## Key Features

### Static Methods

No need to instantiate service classes - call methods directly:

```typescript
const project = await ProjectService.getById(id);
```

### Type Safety

All methods use TypeScript types and Prisma-generated types for compile-time safety.

### Relation Handling

Services include Prisma relations when needed, using `include` to fetch related data efficiently.

### Ordering and Filtering

Services support ordering and filtering to provide consistent data access patterns.

## Standard Methods

- **getAll()** - Retrieve all entities
- **getById(id)** - Retrieve single entity by ID
- **create(data)** - Create new entity
- **update(id, data)** - Update existing entity
- **delete(id)** - Delete entity
- **entityExists(id)** - Check if entity exists

## Service Files

- `src/lib/services/project-service.ts`
- `src/lib/services/task-service.ts`
- `src/lib/services/subtask-service.ts`

## Best Practices

1. **Keep services focused** - One service per entity type
2. **Use type-safe inputs** - Validated input types from Zod schemas
3. **Include necessary relations** - Only fetch what you need
4. **Handle errors gracefully** - Throw meaningful errors
5. **Use ordering** - Provide consistent ordering (e.g., by createdAt)
