# Type-Safe Routing

## Overview

Context Forge uses a type-safe routing system that eliminates string-based route errors and provides compile-time validation for route parameters.

## The Problem

Traditional Next.js routing relies on error-prone string literals:

```typescript
// ❌ Easy to make mistakes:
<Link href={`/projects/${id}/tasks/${taskId}`}>View Task</Link>
router.push(`/projects/${id}/edit`); // Typo in route
redirect(`/project/${id}`); // Missing 's' in 'projects'
```

## The Solution

Type-safe routes with compile-time validation:

```typescript
// ✅ Type-safe with autocomplete:
<TypedLink route={routes.projects.tasks.detail} params={{ projectId: id, taskId }}>
  View Task
</TypedLink>

router.push(routes.projects.detail, { projectId: id });
typedRedirect(routes.projects.detail, { projectId: id });

// TypeScript catches errors:
routes.projects.detail.path(); // ❌ Error: projectId required
routes.projects.detail.path({ id }); // ❌ Error: wrong parameter name
```

## Quick Start

### Import Routes

```typescript
import { routes } from '@/lib/routes';
import { TypedLink, useTypedRouter, typedRedirect } from '@/lib/routes/helpers';
```

### Basic Usage

```typescript
// Static routes (no parameters)
routes.home.path(); // '/'
routes.projects.list.path(); // '/projects'

// Routes with parameters (type-checked!)
routes.projects.detail.path({ projectId: '123' }); // '/projects/123'
routes.projects.tasks.detail.path({ projectId: '123', taskId: '456' });
// '/projects/123/tasks/456'

// With query parameters
routes.projects.list.path({ view: 'grid', sort: 'name' });
// '/projects?view=grid&sort=name'
```

## Components & Hooks

### TypedLink (Client Components)

Drop-in replacement for Next.js `Link`:

```typescript
// Static route
<TypedLink route={routes.home}>Home</TypedLink>

// With parameters
<TypedLink route={routes.projects.detail} params={{ projectId: project.id }}>
  View Project
</TypedLink>

// With query params
<TypedLink route={routes.projects.list} query={{ view: 'grid' }}>
  Grid View
</TypedLink>
```

### useTypedRouter (Client Components)

Type-safe router hook:

```typescript
'use client';

import { useTypedRouter } from '@/lib/routes/helpers';

export function MyComponent() {
  const router = useTypedRouter();

  const handleClick = () => {
    // Type-safe navigation
    router.push(routes.projects.detail, { projectId: '123' });
  };

  return <button onClick={handleClick}>View Project</button>;
}
```

### typedRedirect (Server Actions)

Type-safe redirect for server-side:

```typescript
'use server';

import { typedRedirect } from '@/lib/routes/helpers';

export async function createProjectAction(data: FormData) {
  const project = await db.project.create({ data });

  // Type-safe redirect (no need to wrap in redirect()!)
  typedRedirect(routes.projects.detail, { projectId: project.id });
}
```

## Adding New Routes

Edit `src/lib/routes/index.ts`:

```typescript
export const routes = {
  // ... existing routes

  settings: {
    /** User settings - /settings */
    dashboard: route('/settings'),

    /**
     * Profile settings - /settings/profile/[userId]
     * @param userId - User ID
     */
    profile: route('/settings/profile/[userId]'),
  },
};
```

That's it! TypeScript will automatically enforce type safety everywhere the route is used.

## File Structure

```
src/lib/routes/
├── builder.ts      # Route builder utilities and types
├── index.ts        # All route definitions (edit this to add routes)
└── helpers.tsx     # TypedLink, useTypedRouter, typedRedirect
```

## Key Features

- ✅ **Compile-time type checking** - TypeScript catches errors before runtime
- ✅ **Full autocomplete** - IDE suggests routes and parameters
- ✅ **Single source of truth** - All routes defined in one file
- ✅ **Automatic param extraction** - `[projectId]` → `{ projectId: string }`
- ✅ **Query parameter support** - Optional, type-safe query params
- ✅ **Zero runtime overhead** - Pure TypeScript types

## Migration from String Routes

### Before (String-based)

```typescript
// Components
<Link href={`/projects/${projectId}`}>View</Link>

// Server actions
redirect(`/projects/${projectId}`);

// Router
router.push(`/projects/${projectId}/tasks/new`);
```

### After (Type-safe)

```typescript
// Components
<TypedLink route={routes.projects.detail} params={{ projectId }}>
  View
</TypedLink>

// Server actions
typedRedirect(routes.projects.detail, { projectId });

// Router
const router = useTypedRouter();
router.push(routes.projects.tasks.new, { projectId });
```

## Common Patterns

### Form Success Redirects

```typescript
'use server';

export async function createTaskAction(data: FormData) {
  const task = await db.task.create({ data });
  typedRedirect(routes.projects.tasks.detail, {
    projectId: task.projectId,
    taskId: task.id
  });
}
```

### Conditional Navigation

```typescript
function handleEdit() {
  if (canEdit) {
    router.push(routes.projects.tasks.edit, { projectId, taskId });
  } else {
    router.push(routes.projects.tasks.detail, { projectId, taskId });
  }
}
```

### Breadcrumbs

```typescript
const breadcrumbs = [
  { label: 'Home', href: routes.home.path() },
  { label: 'Projects', href: routes.projects.list.path() },
  { label: project.name, href: routes.projects.detail.path({ projectId }) },
];
```

## Related Documentation

- [Forms Pattern](./forms.md) - Using typed routes in form configs
- [Server Actions Pattern](./server-actions.md) - Using typedRedirect in actions
