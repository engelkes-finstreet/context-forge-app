# Type-Safe Routing

## Overview

Context Forge implements a **type-safe routing system** that provides compile-time safety for route parameters, eliminates string-based route errors, and offers excellent developer experience with full autocomplete support.

## Problem Statement

Traditional Next.js routing relies on string literals:

```typescript
// ❌ Problems with string-based routing:
<Link href="/projects/123">View Project</Link>
<Link href={`/projects/${projectId}/tasks/${taskId}`}>View Task</Link>
router.push(`/projects/${id}/edit`); // Easy to make typos
redirect(`/project/${id}`); // Typo: should be "projects"

// No compile-time safety:
// - Typos in route paths
// - Missing or incorrect parameters
// - Changing route structure requires manual find-replace
```

## Solution

Our type-safe routing system provides:

- ✅ **Compile-time type checking** for route parameters
- ✅ **Autocomplete** for all routes in your IDE
- ✅ **Single source of truth** for all application routes
- ✅ **Automatic parameter extraction** from route patterns
- ✅ **Query parameter support** with type safety
- ✅ **Drop-in replacements** for Link and useRouter

## Architecture

### File Structure

```
src/lib/routes/
├── builder.ts      # Route builder utilities and TypeScript types
├── index.ts        # All route definitions
└── helpers.tsx     # React components and hooks (TypedLink, useTypedRouter)
```

### Key Concepts

1. **Route Definition**: Uses `route()` function with pattern string
2. **Type Extraction**: TypeScript automatically extracts params from `[brackets]`
3. **Path Building**: Type-safe `.path()` method generates URLs
4. **Helper Components**: `TypedLink` and `useTypedRouter` for easy usage

## Quick Start

### Basic Usage

```typescript
import { routes } from '@/lib/routes';

// Static route (no parameters)
routes.home.path(); // '/'
routes.projects.list.path(); // '/projects'

// Route with parameters (type-checked!)
routes.projects.detail.path({ projectId: '123' });
// '/projects/123'

// TypeScript error if params are missing or wrong:
routes.projects.detail.path(); // ❌ Error: projectId required
routes.projects.detail.path({ id: '123' }); // ❌ Error: wrong param name

// Multiple parameters
routes.projects.tasks.detail.path({
  projectId: '123',
  taskId: '456'
});
// '/projects/123/tasks/456'

// With query parameters
routes.projects.list.path({ view: 'grid', sort: 'name' });
// '/projects?view=grid&sort=name'
```

### In Components (Client)

```typescript
import { TypedLink } from '@/lib/routes/helpers';
import { routes } from '@/lib/routes';

export function ProjectCard({ project }) {
  return (
    <div>
      <h2>{project.name}</h2>

      {/* Static route */}
      <TypedLink route={routes.projects.list}>
        All Projects
      </TypedLink>

      {/* Route with params - type-safe! */}
      <TypedLink
        route={routes.projects.detail}
        params={{ projectId: project.id }}
      >
        View Details
      </TypedLink>

      {/* With query params */}
      <TypedLink
        route={routes.projects.list}
        query={{ view: 'grid' }}
      >
        Grid View
      </TypedLink>
    </div>
  );
}
```

### With useRouter Hook

```typescript
'use client';

import { useTypedRouter } from '@/lib/routes/helpers';
import { routes } from '@/lib/routes';

export function ProjectForm() {
  const router = useTypedRouter();

  const handleSubmit = async (data) => {
    const project = await createProject(data);

    // Type-safe navigation
    router.push(routes.projects.detail, { projectId: project.id });
  };

  const handleCancel = () => {
    // Navigate back
    router.back();
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### In Server Actions

```typescript
'use server';

import { redirect } from 'next/navigation';
import { typedRedirect } from '@/lib/routes/helpers';
import { routes } from '@/lib/routes';

export async function createProjectAction(data: FormData) {
  const project = await db.project.create({ data });

  // Type-safe redirect
  redirect(typedRedirect(routes.projects.detail, {
    projectId: project.id
  }));
}

export async function deleteProjectAction(projectId: string) {
  await db.project.delete({ where: { id: projectId } });

  // Redirect to list
  redirect(typedRedirect(routes.projects.list));
}
```

### In Form Configs

```typescript
import { routes } from '@/lib/routes';

export const createProjectFormConfig = {
  onSuccess: (router, data) => {
    // Type-safe navigation in callback
    router.push(routes.projects.detail.path({ projectId: data.id }));
  },
};
```

## Adding New Routes

### 1. Define the Route

Add to `src/lib/routes/index.ts`:

```typescript
export const routes = {
  // ... existing routes

  analytics: {
    /** Analytics dashboard - /analytics */
    dashboard: route('/analytics'),

    /**
     * Project analytics - /analytics/projects/[projectId]
     * @param projectId - UUID of the project
     */
    project: route('/analytics/projects/[projectId]'),
  },
};
```

### 2. Use the Route

```typescript
// In a component
<TypedLink route={routes.analytics.dashboard}>
  View Analytics
</TypedLink>

// With params
<TypedLink
  route={routes.analytics.project}
  params={{ projectId: project.id }}
>
  Project Analytics
</TypedLink>

// In a server action
redirect(typedRedirect(routes.analytics.dashboard));
```

That's it! No other changes needed. TypeScript will enforce type safety everywhere.

## Advanced Usage

### Dynamic Subtask Type Routes

The system supports dynamic route generation for typed subtasks:

```typescript
// In type-selector.tsx
import { routes } from '@/lib/routes';

const subtaskTypeRoutes = {
  generic: routes.projects.tasks.subtasks.newGeneric,
  'inquiry-process': routes.projects.tasks.subtasks.newInquiryProcess,
  form: routes.projects.tasks.subtasks.newForm,
  modal: routes.projects.tasks.subtasks.newModal,
} as const;

function handleTypeSelect(type: SubtaskType) {
  const route = subtaskTypeRoutes[type];
  router.push(route, { projectId, taskId });
}
```

### Query Parameters

Query parameters are always optional and support multiple types:

```typescript
// String value
routes.projects.list.path({ search: 'example' });
// '/projects?search=example'

// Number value
routes.projects.list.path({ page: 2, limit: 10 });
// '/projects?page=2&limit=10'

// Boolean value
routes.projects.list.path({ archived: true });
// '/projects?archived=true'

// Array values (multiple params with same key)
routes.projects.list.path({ tags: ['important', 'urgent'] });
// '/projects?tags=important&tags=urgent'

// Undefined values are ignored
routes.projects.list.path({ search: undefined });
// '/projects'
```

### Getting Route Patterns

Access the original pattern for debugging or validation:

```typescript
routes.projects.detail.pattern;
// '/projects/[projectId]'

routes.projects.tasks.edit.pattern;
// '/projects/[projectId]/tasks/[taskId]/edit'
```

### Type Helpers

Extract parameter types from routes:

```typescript
import { type RouteParams } from '@/lib/routes/builder';
import { routes } from '@/lib/routes';

// Extract params type
type TaskDetailParams = RouteParams<typeof routes.projects.tasks.detail>;
// { projectId: string; taskId: string }

// Use in function signatures
function navigateToTask(params: TaskDetailParams) {
  router.push(routes.projects.tasks.detail, params);
}
```

## Migration Guide

### Migrating Existing Routes

#### Before (String-based)

```typescript
// Component
<Link href={`/projects/${projectId}`}>View</Link>

// Server action
redirect(`/projects/${projectId}`);

// Router
router.push(`/projects/${projectId}/tasks/new`);
```

#### After (Type-safe)

```typescript
// Component
<TypedLink route={routes.projects.detail} params={{ projectId }}>
  View
</TypedLink>

// Server action
redirect(typedRedirect(routes.projects.detail, { projectId }));

// Router
const router = useTypedRouter();
router.push(routes.projects.tasks.new, { projectId });
```

### Migration Checklist

- [ ] Replace `<Link href={...}>` with `<TypedLink route={...}>`
- [ ] Replace `router.push(path)` with `useTypedRouter().push(route, params)`
- [ ] Replace `redirect(path)` with `redirect(typedRedirect(route, params))`
- [ ] Update form configs to use `route.path()` instead of string templates
- [ ] Remove string constant route definitions

## Best Practices

### ✅ Do

```typescript
// Use TypedLink for navigation
<TypedLink route={routes.projects.detail} params={{ projectId }}>
  View Project
</TypedLink>

// Use useTypedRouter for programmatic navigation
const router = useTypedRouter();
router.push(routes.home);

// Use typedRedirect in server actions
redirect(typedRedirect(routes.projects.list));

// Document new routes with JSDoc comments
export const routes = {
  projects: {
    /**
     * Project settings page - /projects/[projectId]/settings
     * @param projectId - UUID of the project
     */
    settings: route('/projects/[projectId]/settings'),
  },
};
```

### ❌ Don't

```typescript
// Don't use string literals for routes
<Link href="/projects/123">View</Link> // ❌

// Don't construct paths manually
const path = `/projects/${id}/tasks/${taskId}`; // ❌

// Don't use regular Link when you can use TypedLink
<Link href={routes.home.path()}>Home</Link> // ❌ Use TypedLink

// Don't skip parameters
routes.projects.detail.path({}); // ❌ TypeScript error
```

## Common Patterns

### Conditional Navigation

```typescript
function handleClick() {
  if (isEditing) {
    router.push(routes.projects.tasks.edit, { projectId, taskId });
  } else {
    router.push(routes.projects.tasks.detail, { projectId, taskId });
  }
}
```

### Navigation with State

```typescript
// Pass query params for UI state
router.push(routes.projects.list, undefined, {
  view: 'grid',
  sort: 'date',
  filter: 'active'
});
```

### Breadcrumb Generation

```typescript
function Breadcrumbs({ projectId, taskId }) {
  return (
    <nav>
      <TypedLink route={routes.home}>Home</TypedLink>
      <TypedLink route={routes.projects.list}>Projects</TypedLink>
      <TypedLink route={routes.projects.detail} params={{ projectId }}>
        {project.name}
      </TypedLink>
      {taskId && (
        <TypedLink
          route={routes.projects.tasks.detail}
          params={{ projectId, taskId }}
        >
          {task.title}
        </TypedLink>
      )}
    </nav>
  );
}
```

## TypeScript Features

### Autocomplete

The route system provides full autocomplete in your IDE:

- `routes.` → See all top-level route groups
- `routes.projects.` → See all project routes
- `routes.projects.tasks.detail.path(` → See required params with JSDoc

### Type Errors

TypeScript will catch errors at compile time:

```typescript
// Missing parameter
routes.projects.detail.path();
// ❌ Error: An argument for 'params' was not provided.

// Wrong parameter name
routes.projects.detail.path({ id: '123' });
// ❌ Error: Object literal may only specify known properties,
//           and 'id' does not exist in type '{ projectId: string }'

// Wrong parameter type
routes.projects.detail.path({ projectId: 123 });
// ❌ Error: Type 'number' is not assignable to type 'string'
```

### Hover Documentation

Hover over routes in your IDE to see JSDoc documentation:

```typescript
routes.projects.tasks.detail
//    ^ Hover shows: "Task detail page - /projects/[projectId]/tasks/[taskId]"
//                   "@param projectId - UUID of the parent project"
//                   "@param taskId - UUID of the task"
```

## Testing

### Unit Tests

```typescript
import { routes } from '@/lib/routes';

describe('Routes', () => {
  it('generates correct path for project detail', () => {
    expect(
      routes.projects.detail.path({ projectId: '123' })
    ).toBe('/projects/123');
  });

  it('generates correct path with query params', () => {
    expect(
      routes.projects.list.path({ view: 'grid' })
    ).toBe('/projects?view=grid');
  });
});
```

### Integration Tests

```typescript
import { render, screen } from '@testing-library/react';
import { TypedLink } from '@/lib/routes/helpers';
import { routes } from '@/lib/routes';

test('TypedLink renders with correct href', () => {
  render(
    <TypedLink route={routes.projects.detail} params={{ projectId: '123' }}>
      View
    </TypedLink>
  );

  expect(screen.getByRole('link')).toHaveAttribute('href', '/projects/123');
});
```

## Troubleshooting

### "An argument for 'params' was not provided"

**Problem**: Route requires parameters but none were provided.

**Solution**: Pass the required parameters:

```typescript
// ❌ Error
routes.projects.detail.path();

// ✅ Fixed
routes.projects.detail.path({ projectId: '123' });
```

### "Property does not exist in type"

**Problem**: Wrong parameter name or extra parameter provided.

**Solution**: Check the route definition and use correct parameter names:

```typescript
// ❌ Error
routes.projects.detail.path({ id: '123' });

// ✅ Fixed (parameter is named 'projectId')
routes.projects.detail.path({ projectId: '123' });
```

### TypedLink not updating href

**Problem**: Using dynamic values that TypeScript can't track.

**Solution**: Ensure params object is properly typed:

```typescript
// ❌ May cause issues
const params = { projectId };

// ✅ Better
const params: { projectId: string } = { projectId };
```

## Performance Considerations

- **Build Time**: Route definitions are compiled at build time, zero runtime overhead
- **Bundle Size**: Minimal impact (~2KB gzipped for the route system)
- **Type Checking**: Only affects TypeScript compilation, not runtime
- **Tree Shaking**: Unused routes are tree-shaken in production builds

## Related Documentation

- [Forms Pattern](./forms.md) - Using typed routes in form configs
- [Server Actions Pattern](./server-actions.md) - Using typed redirects in actions
- [Next.js 15 Patterns](../guides/nextjs-15-patterns.md) - App Router integration

## Future Enhancements

Potential improvements to the routing system:

- [ ] Middleware integration for route guards
- [ ] Generate sitemap from route definitions
- [ ] Route-based code splitting hints
- [ ] Validate route params at runtime (Zod integration)
- [ ] Generate OpenAPI paths from routes
- [ ] i18n route prefixes

## Resources

- [Next.js Routing Documentation](https://nextjs.org/docs/app/building-your-application/routing)
- [TypeScript Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [Type-Safe Routing in Next.js](https://www.youtube.com/watch?v=dQw4w9WgXcQ) (Article)
