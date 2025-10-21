# Best Practices

## Database Queries

### 1. Always Use the Service Layer

Encapsulate all database logic in services:

```typescript
// ✅ Good - using service layer
const projects = await ProjectService.getAll();

// ❌ Bad - direct database access in components
const projects = await db.project.findMany();
```

**Why?**
- Centralized business logic
- Easier to test
- Consistent error handling
- Reusable across the application

### 2. Include Only Necessary Relations

Only include the relations you need:

```typescript
// ✅ Good - minimal relations
static async getAll() {
  return await db.project.findMany({
    include: {
      _count: { select: { tasks: true } }
    }
  });
}

// ❌ Bad - over-fetching
static async getAll() {
  return await db.project.findMany({
    include: {
      tasks: {
        include: {
          subtasks: true  // Not needed for project list
        }
      }
    }
  });
}
```

### 3. Use Prisma's Type Safety

Leverage Prisma's generated types:

```typescript
// ✅ Good - using Prisma types
static async getById(id: string): Promise<Project | null> {
  return await db.project.findUnique({ where: { id } });
}

// ❌ Bad - any type
static async getById(id: string): Promise<any> {
  return await db.project.findUnique({ where: { id } });
}
```

### 4. Handle Null Results

Always check for null results:

```typescript
// ✅ Good - handling null
const project = await ProjectService.getById(id);
if (!project) {
  notFound();
}

// ❌ Bad - assuming project exists
const project = await ProjectService.getById(id);
return <Display project={project} />;  // May crash if null
```

## Forms

### 1. Follow the Established Form Pattern

Use the form config hook pattern:

```typescript
// ✅ Good - using form config hook
export function CreateProjectForm() {
  const formConfig = useCreateProjectFormConfig();
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <DynamicFormField fieldName={fieldNames.name} />
    </Form>
  );
}

// ❌ Bad - custom form without pattern
export function CreateProjectForm() {
  const [name, setName] = useState('');
  // Custom implementation...
}
```

### 2. Use Zod for Validation

Define clear validation schemas:

```typescript
// ✅ Good - clear validation with messages
export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
});

// ❌ Bad - no validation or unclear messages
export const createProjectSchema = z.object({
  name: z.string().min(1),  // Generic error message
  description: z.any(),     // No type safety
});
```

### 3. Provide Clear Error Messages

Make errors user-friendly:

```typescript
// ✅ Good - helpful error messages
z.string().min(8, "Password must be at least 8 characters")
z.string().email("Please enter a valid email address")

// ❌ Bad - generic or technical errors
z.string().min(8)  // Shows: "String must contain at least 8 character(s)"
```

### 4. Show Loading States

Always indicate when forms are submitting:

```typescript
// ✅ Good - disabled during submission
renderFormActions: (isPending) => (
  <Button type="submit" disabled={isPending}>
    {isPending ? 'Submitting...' : 'Submit'}
  </Button>
)

// ❌ Bad - no loading state
renderFormActions: () => (
  <Button type="submit">Submit</Button>
)
```

### 5. Don't Render Hidden Fields

Hidden fields should only be in form config:

```typescript
// ✅ Good - hidden field not rendered
<Form formConfig={formConfig}>
  <DynamicFormField fieldName={fieldNames.name} />
  {/* taskId is in form config but not rendered */}
</Form>

// ❌ Bad - rendering hidden field
<Form formConfig={formConfig}>
  <DynamicFormField fieldName={fieldNames.taskId} />
  <DynamicFormField fieldName={fieldNames.name} />
</Form>
```

## Navigation

### 1. Use Breadcrumb-Style Navigation

Provide context for where users are:

```typescript
<nav>
  <Link href="/projects">Projects</Link>
  <span>/</span>
  <Link href={`/projects/${projectId}`}>{project.name}</Link>
  <span>/</span>
  <span>Tasks</span>
</nav>
```

### 2. Provide "Back" Buttons

Make it easy to navigate back:

```typescript
<Button variant="ghost" onClick={() => router.back()}>
  ← Back
</Button>
```

### 3. Show Parent Context

Display relevant parent information:

```typescript
// ✅ Good - showing task's shared context on subtask edit
<div>
  <h2>Edit Subtask</h2>
  <div className="bg-muted p-4">
    <h3>Shared Context (from parent task)</h3>
    <Markdown>{task.sharedContext}</Markdown>
  </div>
  <SubtaskForm />
</div>
```

## Error Handling

### 1. Catch Errors in Try-Catch Blocks

Handle errors gracefully:

```typescript
// ✅ Good - catching errors
try {
  const project = await ProjectService.create(data);
  revalidatePath('/projects');
  redirect(`/projects/${project.id}`);
} catch (error) {
  return {
    error: error instanceof Error ? error.message : 'Failed to create project',
    message: null,
  };
}

// ❌ Bad - no error handling
const project = await ProjectService.create(data);
redirect(`/projects/${project.id}`);
```

### 2. Return User-Friendly Error Messages

Avoid technical jargon:

```typescript
// ✅ Good - user-friendly message
return {
  error: 'Project name must be unique',
  message: null,
};

// ❌ Bad - technical error
return {
  error: 'Unique constraint failed on field: name',
  message: null,
};
```

### 3. Log Errors for Debugging

Log errors but show friendly messages to users:

```typescript
try {
  // ... operation
} catch (error) {
  console.error('Failed to create project:', error);
  return {
    error: 'Failed to create project. Please try again.',
    message: null,
  };
}
```

### 4. Use notFound() for 404 Errors

Use Next.js built-in not found handling:

```typescript
// ✅ Good - using notFound()
const project = await ProjectService.getById(id);
if (!project) {
  notFound();
}

// ❌ Bad - custom error handling
const project = await ProjectService.getById(id);
if (!project) {
  throw new Error('Project not found');
}
```

## Revalidation

### 1. Always Revalidate After Mutations

Update cache after creating, updating, or deleting:

```typescript
// ✅ Good - revalidating after creation
const project = await ProjectService.create(data);
revalidatePath('/projects');
revalidatePath(`/projects/${project.id}`);

// ❌ Bad - no revalidation
const project = await ProjectService.create(data);
redirect(`/projects/${project.id}`);
```

### 2. Revalidate Parent Pages When Appropriate

Update parent pages when child data changes:

```typescript
// ✅ Good - revalidating parent
const task = await TaskService.create(data);
revalidatePath(`/projects/${task.projectId}`);  // Parent project page
revalidatePath(`/projects/${task.projectId}/tasks/${task.id}`);  // Task page

// ❌ Bad - only revalidating current page
const task = await TaskService.create(data);
revalidatePath(`/projects/${task.projectId}/tasks/${task.id}`);
```

### 3. Use Specific Paths, Not Wildcards

Revalidate specific paths for better performance:

```typescript
// ✅ Good - specific paths
revalidatePath('/projects');
revalidatePath(`/projects/${projectId}`);

// ❌ Bad - wildcards or overly broad
revalidatePath('/projects/*');
revalidatePath('/');
```

## Code Organization

### 1. Keep Components Focused

Each component should have a single responsibility:

```typescript
// ✅ Good - focused components
function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul>
      {projects.map(p => <ProjectListItem key={p.id} project={p} />)}
    </ul>
  );
}

function ProjectListItem({ project }: { project: Project }) {
  return <li>{project.name}</li>;
}

// ❌ Bad - doing too much in one component
function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetching, rendering, forms all in one component...
}
```

### 2. Use Feature-Based Directory Structure

Organize by feature, not by type:

```
// ✅ Good - feature-based
features/
  projects/
    components/
      forms/
      lists/
  tasks/
    components/
      forms/
      lists/

// ❌ Bad - type-based
components/
  forms/
    ProjectForm.tsx
    TaskForm.tsx
  lists/
    ProjectList.tsx
    TaskList.tsx
```

### 3. Co-locate Related Files

Keep related files together:

```
// ✅ Good - co-located
features/
  projects/
    components/
      forms/
        create-project-form/
          create-project-form-config.tsx
          create-project-form.tsx

// ❌ Bad - spread across directories
components/
  forms/
    CreateProjectForm.tsx
hooks/
  useCreateProjectFormConfig.tsx
```

## TypeScript

### 1. Use Strict Mode

Enable strict type checking:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### 2. Avoid `any` Type

Use proper types instead of `any`:

```typescript
// ✅ Good - proper typing
function processProject(project: Project) {
  // ...
}

// ❌ Bad - using any
function processProject(project: any) {
  // ...
}
```

### 3. Infer Types from Zod Schemas

Use `z.infer` for type safety:

```typescript
// ✅ Good - inferred from schema
export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// ❌ Bad - manually typed (can drift from schema)
export type CreateProjectInput = {
  name: string;
  description?: string;
};
```

### 4. Use Discriminated Unions

For type-safe variants:

```typescript
// ✅ Good - discriminated union
type Result =
  | { success: true; data: Project }
  | { success: false; error: string };

// ❌ Bad - mixing success and error
type Result = {
  success: boolean;
  data?: Project;
  error?: string;
};
```

## Performance

### 1. Use Server Components by Default

Only use client components when necessary:

```typescript
// ✅ Good - server component for data fetching
export default async function ProjectsPage() {
  const projects = await ProjectService.getAll();
  return <ProjectList projects={projects} />;
}

// ❌ Bad - client component unnecessarily
'use client';
export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    ProjectService.getAll().then(setProjects);
  }, []);
  return <ProjectList projects={projects} />;
}
```

### 2. Minimize Client-Side JavaScript

Keep bundle sizes small:

```typescript
// ✅ Good - minimal client component
'use client';
export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>Like</button>;
}

// ❌ Bad - large client component with unused code
'use client';
import { HeavyLibrary } from 'heavy-library';
export function LikeButton() {
  // Heavy library loaded but barely used
}
```

### 3. Use Suspense for Loading States

Improve perceived performance:

```typescript
// ✅ Good - suspense boundary
<Suspense fallback={<Skeleton />}>
  <ProjectList />
</Suspense>

// ❌ Bad - loading entire page
{loading ? <FullPageSpinner /> : <ProjectList />}
```

## Security

### 1. Validate All Inputs

Never trust user input:

```typescript
// ✅ Good - validating input
export async function createProject(data: unknown) {
  const validated = createProjectSchema.parse(data);
  return await db.project.create({ data: validated });
}

// ❌ Bad - no validation
export async function createProject(data: any) {
  return await db.project.create({ data });
}
```

### 2. Use Server Actions for Mutations

Don't expose database operations to client:

```typescript
// ✅ Good - server action
'use server';
export async function deleteProject(id: string) {
  await ProjectService.delete(id);
}

// ❌ Bad - client-side deletion
'use client';
export function DeleteButton({ id }: { id: string }) {
  const handleDelete = () => {
    db.project.delete({ where: { id } });  // Exposing DB to client
  };
}
```
