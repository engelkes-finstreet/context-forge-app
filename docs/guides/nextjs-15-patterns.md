# Next.js 15 Patterns

## Overview

Context Forge uses Next.js 15 with the App Router, which introduces several new patterns and conventions.

## Async Params

In Next.js 15, route parameters are now promises that must be awaited.

### Page Props

```typescript
interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const search = await searchParams;

  // Use id and search...
}
```

### Layout Props

```typescript
interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { id } = await params;

  // Use id...

  return <div>{children}</div>;
}
```

### Multiple Parameters

```typescript
interface PageProps {
  params: Promise<{
    projectId: string;
    taskId: string;
    subtaskId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { projectId, taskId, subtaskId } = await params;

  // Use all parameters...
}
```

## Server Components

All pages are React Server Components by default.

### Benefits

- **Direct database access**: Query data directly in components
- **No client-side JavaScript**: Smaller bundle sizes
- **Better SEO**: Fully rendered HTML sent to client
- **Automatic code splitting**: Only load what's needed

### Example

```typescript
import { db } from '@/lib/db';

export default async function ProjectsPage() {
  // Direct database query in component
  const projects = await db.project.findMany({
    include: {
      _count: {
        select: { tasks: true }
      }
    }
  });

  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### When to Use Client Components

Use `'use client'` directive when you need:
- Event handlers (`onClick`, `onChange`, etc.)
- React hooks (`useState`, `useEffect`, etc.)
- Browser APIs (`window`, `localStorage`, etc.)
- Third-party libraries that use client features

```typescript
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

## Server Actions

Server actions handle mutations from forms and other interactions.

### Basic Server Action

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProject(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  const project = await db.project.create({
    data: { name, description }
  });

  revalidatePath('/projects');
  redirect(`/projects/${project.id}`);
}
```

### Type-Safe Server Actions

Using Zod for validation:

```typescript
'use server';

import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export type ProjectFormState = {
  error: string | null;
  message: string | null;
} | null;

export async function createProjectAction(
  state: ProjectFormState,
  data: z.infer<typeof createProjectSchema>
): Promise<ProjectFormState> {
  try {
    const validated = createProjectSchema.parse(data);
    const project = await db.project.create({ data: validated });

    revalidatePath('/projects');
    redirect(`/projects/${project.id}`);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to create',
      message: null,
    };
  }
}
```

### Using Server Actions in Forms

```typescript
'use client';

import { useFormState } from 'react-dom';
import { createProjectAction } from '@/lib/actions/project-actions';

export function CreateProjectForm() {
  const [state, formAction] = useFormState(createProjectAction, null);

  return (
    <form action={formAction}>
      <input name="name" required />
      {state?.error && <p>{state.error}</p>}
      <button type="submit">Create</button>
    </form>
  );
}
```

## Data Fetching

### Server Component Data Fetching

Fetch data directly in server components:

```typescript
export default async function TaskPage({ params }: PageProps) {
  const { taskId } = await params;

  const task = await db.task.findUnique({
    where: { id: taskId },
    include: {
      project: true,
      subtasks: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!task) {
    notFound();
  }

  return <TaskDetail task={task} />;
}
```

### Parallel Data Fetching

```typescript
export default async function DashboardPage() {
  // Fetch in parallel
  const [projects, recentTasks] = await Promise.all([
    db.project.findMany(),
    db.task.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5
    })
  ]);

  return (
    <div>
      <ProjectList projects={projects} />
      <RecentTasks tasks={recentTasks} />
    </div>
  );
}
```

## Revalidation

### Path Revalidation

```typescript
import { revalidatePath } from 'next/cache';

// Revalidate specific page
revalidatePath('/projects');

// Revalidate dynamic route
revalidatePath(`/projects/${projectId}`);

// Revalidate layout
revalidatePath('/projects', 'layout');

// Revalidate all under path
revalidatePath('/projects', 'page');
```

### Tag Revalidation

```typescript
import { revalidateTag } from 'next/cache';

// Tag data when fetching
fetch('https://api.example.com/data', {
  next: { tags: ['projects'] }
});

// Revalidate by tag
revalidateTag('projects');
```

## Navigation

### Link Component

```typescript
import Link from 'next/link';

export function ProjectLink({ projectId }: { projectId: string }) {
  return (
    <Link href={`/projects/${projectId}`}>
      View Project
    </Link>
  );
}
```

### Programmatic Navigation

```typescript
'use client';

import { useRouter } from 'next/navigation';

export function NavigateButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.push('/projects')}>
      Go to Projects
    </button>
  );
}
```

### Redirect

Server-side redirect:

```typescript
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return <Dashboard user={user} />;
}
```

## Error Handling

### Error Boundary

Create `error.tsx` in route directory:

```typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Not Found

Create `not-found.tsx`:

```typescript
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  );
}
```

Use `notFound()` to trigger:

```typescript
import { notFound } from 'next/navigation';

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const item = await db.item.findUnique({ where: { id } });

  if (!item) {
    notFound();
  }

  return <ItemDetail item={item} />;
}
```

## Loading States

### Loading UI

Create `loading.tsx`:

```typescript
export default function Loading() {
  return <div>Loading...</div>;
}
```

### Suspense Boundaries

```typescript
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectList />
      </Suspense>
      <Suspense fallback={<div>Loading tasks...</div>}>
        <TaskList />
      </Suspense>
    </div>
  );
}
```

## Metadata

### Static Metadata

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Manage your projects',
};

export default function ProjectsPage() {
  return <div>Projects</div>;
}
```

### Dynamic Metadata

```typescript
import { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await db.project.findUnique({ where: { id } });

  return {
    title: project?.name || 'Project',
    description: project?.description,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  // ... page implementation
}
```

## Best Practices

### 1. Use Server Components by Default

Only use client components when necessary:

```typescript
// ✅ Good - server component
export default async function Page() {
  const data = await fetchData();
  return <Display data={data} />;
}

// ❌ Bad - unnecessary client component
'use client';
export default function Page() {
  const [data, setData] = useState(null);
  useEffect(() => { fetchData().then(setData); }, []);
  return <Display data={data} />;
}
```

### 2. Fetch Data Where It's Needed

```typescript
// ✅ Good - fetch in component that needs it
async function ProjectList() {
  const projects = await db.project.findMany();
  return <List projects={projects} />;
}

// ❌ Bad - passing data through many layers
async function Page() {
  const projects = await db.project.findMany();
  return <Layout><Sidebar><ProjectList projects={projects} /></Sidebar></Layout>;
}
```

### 3. Always Revalidate After Mutations

```typescript
export async function createProject(data: CreateInput) {
  const project = await db.project.create({ data });
  revalidatePath('/projects');
  revalidatePath(`/projects/${project.id}`);
  redirect(`/projects/${project.id}`);
}
```

### 4. Handle Errors Gracefully

```typescript
export default async function Page({ params }: PageProps) {
  const { id } = await params;

  try {
    const item = await db.item.findUnique({ where: { id } });
    if (!item) notFound();
    return <ItemDetail item={item} />;
  } catch (error) {
    throw new Error('Failed to load item');
  }
}
```

### 5. Use TypeScript Strict Mode

Enable in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```
