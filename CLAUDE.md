# Context Forge - Documentation

## Overview

Context Forge is a full-stack Next.js application designed to manage AI agent tasks and contexts. It provides a structured way to organize projects, tasks, and subtasks with shared contexts that can be accessed and modified by Claude Code through an integrated MCP (Model Context Protocol) server.

### Key Features

- **Project Management**: Organize work into distinct projects
- **Task Hierarchy**: Tasks with shared context accessible by all subtasks
- **Subtask Management**: Individual subtasks with their own content
- **Form-based UI**: Validated forms with markdown support
- **MCP Server Integration**: Claude Code can read/update contexts directly from the database

---

## Architecture

### Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS 4
- **Forms**: React Hook Form + Zod validation
- **Backend**: Next.js Server Actions & API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better-auth

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js Application                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐       ┌──────────────────┐       │
│  │   Web UI Pages  │       │  MCP Server API  │       │
│  │  (Authenticated)│       │   (/api/mcp/*)   │       │
│  └────────┬────────┘       └────────┬─────────┘       │
│           │                         │                  │
│  ┌────────┴─────────────────────────┴─────────┐       │
│  │         Server Actions / API Routes         │       │
│  └─────────────────┬────────────────────────────┘      │
│                    │                                    │
│  ┌─────────────────┴────────────────────────────┐      │
│  │          Service Layer (Business Logic)       │      │
│  └─────────────────┬────────────────────────────┘      │
│                    │                                    │
│  ┌─────────────────┴────────────────────────────┐      │
│  │         Prisma ORM (Database Access)         │      │
│  └─────────────────┬────────────────────────────┘      │
└────────────────────┼────────────────────────────────────┘
                     │
           ┌─────────┴─────────┐
           │   PostgreSQL DB    │
           └───────────────────┘
```

---

## Database Schema

### Entity Relationships

```
Project (1) ──────< Task (n)
                     │
                     └──────< Subtask (n)
```

### Models

#### Project
```prisma
model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tasks       Task[]
}
```

#### Task
```prisma
model Task {
  id            String   @id @default(cuid())
  projectId     String
  name          String
  sharedContext String   @db.Text  // Markdown content shared with all subtasks
  order         Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  project       Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  subtasks      Subtask[]
}
```

#### Subtask
```prisma
model Subtask {
  id        String   @id @default(cuid())
  taskId    String
  name      String
  content   String   @db.Text  // Markdown content specific to this subtask
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
}
```

### Key Features

- **Cascading Deletes**: Deleting a project removes all tasks and subtasks
- **Ordering**: Tasks and subtasks maintain order for consistent display
- **Shared Context**: Tasks have a `sharedContext` field that all subtasks can access
- **Timestamps**: Automatic `createdAt` and `updatedAt` tracking
- **Typed Subtasks**: Subtasks have a `type` field (GENERIC, FORM, MODAL, INQUIRY_PROCESS) with type-specific metadata

---

## Typed Subtask System Architecture

Context Forge implements a **two-layer validation system** that separates user input (forms) from database input (Prisma). This architecture enables type-specific forms with different fields while maintaining type safety throughout the application.

### Core Principles

1. **Form Schemas** define what users input (type-specific fields)
2. **Database Schemas** define what gets stored in the database
3. **Server Actions** transform form data → database data
4. **Type System** ensures compile-time safety with discriminated unions

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Input Layer                     │
│         (Form Schemas - Type-Specific Fields)           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Generic Form Schema          Form Type Schema         │
│  - taskId                     - taskId                  │
│  - name                       - name                    │
│  - content (user writes)      - fields[] (config)       │
│                               - submitEndpoint          │
│                               - submitButtonText        │
│                                                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Server Action       │
         │   Transformation      │
         │                       │
         │  1. Validate form     │
         │  2. Build metadata    │
         │  3. Add type field    │
         │  4. Generate content* │
         │  5. Create DB input   │
         └───────────┬───────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Database Input Layer                    │
│              (Prisma Schema - Unified)                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  CreateSubtaskInput (all types)                         │
│  - taskId: string                                       │
│  - name: string                                         │
│  - type: SubtaskType (GENERIC | FORM | MODAL | ...)    │
│  - content: string                                      │
│  - metadata: SubtaskMetadata (type-specific JSON)       │
│                                                         │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
              [Prisma ORM]
                     │
                     ▼
            [PostgreSQL Database]

* Future enhancement for non-Generic types
```

### Subtask Types

Currently supported subtask types:

| Type | Status | Description | Metadata |
|------|--------|-------------|----------|
| `GENERIC` | ✅ Implemented | Standard subtask with name & content | `null` |
| `INQUIRY_PROCESS` | 🔄 Planned | Multi-step form wizard | Steps, progress config |
| `FORM` | 🔄 Planned | Single form with field definitions | Fields, validation, endpoint |
| `MODAL` | 🔄 Planned | Modal dialog component | Size, trigger, close behavior |

### Example: Generic Type Flow

**1. User fills form (Form Schema):**
```typescript
// Type: CreateGenericSubtaskFormInput
{
  taskId: "cm123...",
  name: "Implement login",
  content: "Create login form with email/password..."
}
```

**2. Server action transforms (Type-Specific Action):**
```typescript
// createGenericSubtaskAction
const subtaskInput: CreateSubtaskInput = {
  ...formData,                    // taskId, name, content
  type: SubtaskType.GENERIC,      // Added by action
  metadata: null,                 // Generic has no metadata
};
```

**3. Database stores (Database Schema):**
```typescript
// Prisma creates record
{
  id: "cm456...",
  taskId: "cm123...",
  name: "Implement login",
  type: "GENERIC",
  content: "Create login form with email/password...",
  metadata: null,
  order: 0,
  createdAt: "2025-01-20T...",
  updatedAt: "2025-01-20T..."
}
```

### Type-Specific Metadata (Future)

When implementing new subtask types, metadata stores type-specific configuration:

**Example: Form Type**
```typescript
// Form Schema (what user inputs)
{
  taskId: "cm123...",
  name: "User Registration Form",
  fields: [
    { name: "email", type: "email", label: "Email", required: true },
    { name: "password", type: "password", label: "Password", required: true }
  ],
  submitEndpoint: "/api/register",
  submitButtonText: "Register"
}

// After transformation (what gets stored)
{
  taskId: "cm123...",
  name: "User Registration Form",
  type: "FORM",
  content: "<!-- AI-generated content based on metadata -->",
  metadata: {
    type: "FORM",
    fields: [...],
    submitEndpoint: "/api/register",
    submitButtonText: "Register"
  }
}
```

### File Organization

```
src/
├── lib/validations/
│   ├── subtask-schema.ts                    # Database schemas
│   └── forms/                               # Form schemas (user input)
│       ├── generic-subtask-form-schema.ts
│       ├── form-subtask-form-schema.ts      # (future)
│       ├── modal-subtask-form-schema.ts     # (future)
│       └── inquiry-process-form-schema.ts   # (future)
│
├── lib/actions/
│   └── subtask-actions.ts
│       ├── createGenericSubtaskAction       # Generic type
│       ├── createFormSubtaskAction          # (future)
│       ├── createModalSubtaskAction         # (future)
│       └── createInquiryProcessAction       # (future)
│
├── features/subtasks/
│   ├── types/
│   │   └── subtask-types.ts                 # TypeScript types & metadata
│   ├── config/
│   │   └── type-config.ts                   # UI config (icons, labels, routes)
│   └── components/
│       ├── type-selector/                   # Type selection UI
│       │   ├── type-card.tsx
│       │   └── type-selector.tsx
│       └── forms/
│           ├── generic-subtask/             # Generic form
│           ├── form-subtask/                # (future)
│           ├── modal-subtask/               # (future)
│           └── inquiry-process-subtask/     # (future)
```

### How to Add a New Subtask Type

Follow these steps to implement a new type (e.g., "Form"):

#### 1. Enable the Type

**File:** `src/features/subtasks/config/type-config.ts`
```typescript
[SubtaskType.FORM]: {
  // ...
  enabled: true,  // Change from false to true
}
```

#### 2. Create Form Schema

**File:** `src/lib/validations/forms/form-subtask-form-schema.ts`
```typescript
export const createFormSubtaskFormSchema = z.object({
  taskId: z.string().cuid(),
  name: z.string().min(1),

  // Type-specific fields
  fields: z.array(z.object({
    name: z.string(),
    type: z.enum(['text', 'email', 'password', ...]),
    label: z.string(),
    required: z.boolean().optional(),
  })).min(1),

  submitEndpoint: z.string().url().optional(),
  submitButtonText: z.string().default("Submit"),
});

export type CreateFormSubtaskFormInput = z.infer<typeof createFormSubtaskFormSchema>;
```

#### 3. Create Server Action

**File:** `src/lib/actions/subtask-actions.ts`
```typescript
export async function createFormSubtaskAction(
  state: SubtaskFormState,
  formData: CreateFormSubtaskFormInput
): Promise<SubtaskFormState> {
  try {
    // Build metadata from form fields
    const metadata: FormMetadata = {
      type: SubtaskType.FORM,
      fields: formData.fields,
      submitEndpoint: formData.submitEndpoint,
      submitButtonText: formData.submitButtonText,
    };

    // Optional: Generate content via AI
    const content = formData.content || await generateContent(metadata);

    // Transform to database input
    const subtaskInput: CreateSubtaskInput = {
      taskId: formData.taskId,
      name: formData.name,
      type: SubtaskType.FORM,
      content,
      metadata,
    };

    const subtask = await SubtaskService.createSubtask(subtaskInput);
    // ... revalidate and redirect
  } catch (error) {
    // ... error handling
  }
}
```

#### 4. Create Form Components

**File:** `src/features/subtasks/components/forms/form-subtask/form-subtask-form-config.tsx`
```typescript
export function useCreateFormSubtaskFormConfig(taskId: string) {
  const defaultValues: DeepPartial<CreateFormSubtaskFormInput> = {
    taskId,
    name: '',
    fields: [],
    submitButtonText: 'Submit',
  };

  const fields: FormFieldsType<CreateFormSubtaskFormInput> = {
    taskId: { type: 'hidden' },
    name: {
      type: 'input',
      label: 'Form Name',
    },
    fields: {
      type: 'custom',  // Array field for form fields
      label: 'Form Fields',
    },
    // ... other fields
  };

  return {
    fields,
    defaultValues,
    schema: createFormSubtaskFormSchema,  // ← Form schema, not DB schema
    serverAction: createFormSubtaskAction, // ← Type-specific action
    // ...
  };
}
```

**File:** `src/features/subtasks/components/forms/form-subtask/form-subtask-form.tsx`
```typescript
export function CreateFormSubtaskForm({ taskId }: { taskId: string }) {
  const formConfig = useCreateFormSubtaskFormConfig(taskId);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <div className="space-y-6">
        <DynamicFormField fieldName={fieldNames.name} />
        <FormFieldsArrayEditor fieldName={fieldNames.fields} />
        <DynamicFormField fieldName={fieldNames.submitEndpoint} />
        <DynamicFormField fieldName={fieldNames.submitButtonText} />
      </div>
    </Form>
  );
}
```

#### 5. Create Route

**File:** `src/app/(authenticated)/projects/[projectId]/tasks/[taskId]/subtasks/new/form/page.tsx`
```typescript
import { CreateFormSubtaskForm } from '@/features/subtasks/components/forms/form-subtask/form-subtask-form';

export default async function NewFormSubtaskPage({ params }: PageProps) {
  const { projectId, taskId } = await params;
  // ... validation

  return (
    <div>
      <h1>Create Form Subtask</h1>
      <CreateFormSubtaskForm taskId={taskId} />
    </div>
  );
}
```

### Key Benefits

✅ **Separation of Concerns**: Form validation ≠ Database validation
✅ **Type Safety**: Compile-time checks prevent invalid metadata
✅ **Extensibility**: Easy to add new types without breaking existing ones
✅ **Flexibility**: Each type has custom form fields tailored to its needs
✅ **Clean Architecture**: Clear data flow from user → form → action → database
✅ **Future-Proof**: Ready for AI content generation or other transformations

### Type Immutability

Once created, a subtask's type **cannot be changed**. This ensures:
- Metadata always matches the type
- No invalid state combinations
- Simpler migration logic
- Clearer user expectations

The edit form displays the type as a readonly badge to reinforce this constraint.

---

## Application Features

### 1. Project Management

**Pages:**
- `/projects` - List all projects
- `/projects/new` - Create new project
- `/projects/[projectId]` - View project details and tasks

**Features:**
- Create, view, and list projects
- Display task count per project
- Project descriptions (optional)

**Files:**
- Service: `src/lib/services/project-service.ts`
- Actions: `src/lib/actions/project-actions.ts`
- Validation: `src/lib/validations/project-schema.ts`
- Forms: `src/features/projects/components/forms/`

### 2. Task Management

**Pages:**
- `/projects/[projectId]/tasks/new` - Create new task
- `/projects/[projectId]/tasks/[taskId]` - View task details and subtasks

**Features:**
- Create tasks within projects
- Define shared context (markdown support)
- View subtask count
- Shared context visible on task detail page

**Files:**
- Service: `src/lib/services/task-service.ts`
- Actions: `src/lib/actions/task-actions.ts`
- Validation: `src/lib/validations/task-schema.ts`
- Forms: `src/features/tasks/components/forms/`

### 3. Subtask Management

**Pages:**
- `/projects/[projectId]/tasks/[taskId]/subtasks/new` - Create new subtask
- `/projects/[projectId]/tasks/[taskId]/subtasks/[subtaskId]/edit` - Edit subtask

**Features:**
- Create subtasks within tasks
- Edit subtask content (markdown support)
- View parent task's shared context while editing
- Full CRUD operations

**Files:**
- Service: `src/lib/services/subtask-service.ts`
- Actions: `src/lib/actions/subtask-actions.ts`
- Validation: `src/lib/validations/subtask-schema.ts`
- Forms: `src/features/subtasks/components/forms/`

---

## MCP Server Integration

The MCP (Model Context Protocol) server allows Claude Code to interact with Context Forge data programmatically.

### Resource URI Format

```
context-forge://project/{projectId}/task/{taskId}/subtask/{subtaskId}
```

### API Endpoints

#### 1. List Resources
```
GET /api/mcp/list-resources
```

**Response:**
```json
{
  "resources": [
    {
      "uri": "context-forge://project/{id}/task/{id}",
      "name": "Project Name / Task Name",
      "description": "Task in Project Name with 3 subtask(s)",
      "mimeType": "text/markdown"
    },
    {
      "uri": "context-forge://project/{id}/task/{id}/subtask/{id}",
      "name": "Project Name / Task Name / Subtask Name",
      "description": "Subtask in Task Name",
      "mimeType": "text/markdown"
    }
  ]
}
```

**Purpose:** Discover all available resources (tasks and subtasks) across all projects.

#### 2. Read Resource
```
POST /api/mcp/read-resource
Content-Type: application/json

{
  "uri": "context-forge://project/{id}/task/{id}/subtask/{id}"
}
```

**Response:**
```json
{
  "contents": [
    {
      "uri": "context-forge://project/{id}/task/{id}/subtask/{id}",
      "mimeType": "text/markdown",
      "text": "# Subtask Name\n\n## Shared Context (from parent task)\n\n...\n\n## Content\n\n..."
    }
  ]
}
```

**Purpose:** Read the markdown content of a task or subtask.

**Markdown Format for Subtasks:**
```markdown
# {Subtask Name}

## Shared Context (from parent task)

{Task's sharedContext field}

## Content

{Subtask's content field}
```

**Markdown Format for Tasks:**
```markdown
# {Task Name}

## Shared Context

{Task's sharedContext field}
```

#### 3. Update Resource
```
POST /api/mcp/update-resource
Content-Type: application/json

{
  "uri": "context-forge://project/{id}/task/{id}/subtask/{id}",
  "text": "Updated markdown content"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subtask content updated successfully"
}
```

**Purpose:** Update task shared context or subtask content.

**What gets updated:**
- For tasks: Updates the `sharedContext` field
- For subtasks: Updates the `content` field

### MCP Implementation Files

- **Types**: `src/lib/mcp/types.ts`
- **Utilities**: `src/lib/mcp/utils.ts`
- **API Routes**: `src/app/api/mcp/*/route.ts`

---

## Form Pattern

All forms follow a consistent pattern based on the existing codebase:

### Form Structure

```
src/features/{feature}/components/forms/{form-name}/
├── {form-name}-form-config.tsx   # Configuration hook
└── {form-name}-form.tsx          # Form component
```

### Form Config Hook Pattern

```typescript
export function useCreateXFormConfig(): FormConfig<XFormState, XInput> {
  const router = useRouter();

  const defaultValues: DeepPartial<XInput> = { /* ... */ };

  const fields: FormFieldsType<XInput> = {
    fieldName: {
      type: 'input',
      inputType: 'text',
      label: 'Field Label',
      placeholder: 'Placeholder text',
    },
  };

  return {
    fields,
    defaultValues,
    schema: createXSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createXAction,
    formId: 'unique-form-id',
    useErrorAction: () => (state) => {
      toast.error(state?.error || 'Error message');
    },
    useSuccessAction: () => (state) => {
      toast.success(state?.message || 'Success message');
      router.push('/redirect-path');
    },
    renderFormActions: (isPending) => (
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </Button>
    ),
  };
}
```

### Form Component Pattern

```typescript
export function CreateXForm() {
  const formConfig = useCreateXFormConfig();
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <div className="space-y-6">
        <DynamicFormField fieldName={fieldNames.fieldName} />
      </div>
    </Form>
  );
}
```

### Supported Field Types

- `input` - Text input (with `inputType`: text, email, etc.)
- `textarea` - Multi-line text input
- `password` - Password input
- `hidden` - Hidden field (for IDs, metadata)
- More types available via `DynamicFormField`

### Important: Hidden Fields

**DO NOT render `DynamicFormField` components for hidden fields.** Hidden fields should only be defined in the form config but not rendered in the form component.

**Why?** Hidden fields are meant to pass metadata (like IDs) through the form without displaying them to the user. The form values are automatically passed to the server action, including hidden fields, even if they're not rendered.

**Example:**

```typescript
// ❌ WRONG - Don't render hidden fields
<Form formConfig={formConfig}>
  <div className="space-y-6">
    <DynamicFormField fieldName={fieldNames.taskId} /> {/* Hidden field */}
    <DynamicFormField fieldName={fieldNames.name} />
  </div>
</Form>

// ✅ CORRECT - Only render visible fields
<Form formConfig={formConfig}>
  <div className="space-y-6">
    <DynamicFormField fieldName={fieldNames.name} />
    <DynamicFormField fieldName={fieldNames.content} />
    {/* taskId is in form config but not rendered */}
  </div>
</Form>
```

The hidden field values are still included in the form submission through the `defaultValues` in the form config.

---

## Service Layer Pattern

All business logic is encapsulated in service classes:

### Service Structure

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

### Service Files

- `src/lib/services/project-service.ts`
- `src/lib/services/task-service.ts`
- `src/lib/services/subtask-service.ts`

### Key Features

- Static methods for simplicity
- Type-safe with TypeScript
- Include relations when needed
- Support for ordering and filtering

---

## Server Actions Pattern

Server actions handle form submissions using Next.js 15 patterns:

### Action Structure

```typescript
export type EntityFormState = {
  error: string | null;
  message: string | null;
} | null;

export async function createEntityAction(
  state: EntityFormState,
  data: CreateEntityInput
): Promise<EntityFormState> {
  try {
    const entity = await EntityService.create(data);
    revalidatePath('/relevant-path');
    redirect(`/redirect-path/${entity.id}`);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to create entity',
      message: null,
    };
  }
}
```

### Action Files

- `src/lib/actions/project-actions.ts`
- `src/lib/actions/task-actions.ts`
- `src/lib/actions/subtask-actions.ts`

### Important Notes

- Use `revalidatePath()` to update cached data
- Use `redirect()` to navigate after success
- Return error state for display to user
- Type-safe with Zod schemas

---

## Validation Schemas

All input validation uses Zod schemas:

### Schema Structure

```typescript
export const createEntitySchema = z.object({
  field: z.string().min(1, "Field is required"),
  optionalField: z.string().optional(),
});

export type CreateEntityInput = z.infer<typeof createEntitySchema>;
```

### Schema Files

- `src/lib/validations/project-schema.ts`
- `src/lib/validations/task-schema.ts`
- `src/lib/validations/subtask-schema.ts`

### Features

- Type inference with `z.infer`
- Custom error messages
- Optional fields with `.optional()`
- Default values with `.default()`

---

## File Structure

```
src/
├── app/
│   ├── (authenticated)/
│   │   ├── layout.tsx                 # Auth layout wrapper
│   │   └── projects/
│   │       ├── page.tsx               # List projects
│   │       ├── new/page.tsx           # Create project
│   │       └── [projectId]/
│   │           ├── page.tsx           # Project detail
│   │           └── tasks/
│   │               ├── new/page.tsx   # Create task
│   │               └── [taskId]/
│   │                   ├── page.tsx   # Task detail
│   │                   └── subtasks/
│   │                       ├── new/page.tsx                    # Create subtask
│   │                       └── [subtaskId]/edit/page.tsx     # Edit subtask
│   └── api/
│       └── mcp/
│           ├── list-resources/route.ts
│           ├── read-resource/route.ts
│           └── update-resource/route.ts
│
├── features/
│   ├── projects/components/forms/
│   ├── tasks/components/forms/
│   └── subtasks/components/forms/
│
├── lib/
│   ├── actions/              # Server actions
│   ├── services/             # Business logic
│   ├── validations/          # Zod schemas
│   ├── mcp/                  # MCP utilities
│   ├── db.ts                 # Prisma client
│   └── auth.ts               # Better-auth config
│
└── components/
    └── ui/                   # shadcn/ui components
```

---

## Development Setup

### Prerequisites

- Node.js 20+
- PostgreSQL
- npm or yarn

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/context-forge-dev"
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
```

### Commands

```bash
# Start PostgreSQL
npm run db:start

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Push schema changes (development)
npm run db:push

# Open Prisma Studio
npm run db:studio

# Start dev server
npm run dev

# Build for production
npm run build
```

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

---

## Next.js 15 Patterns

### Async Params

In Next.js 15, route params are promises:

```typescript
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  // Use id...
}
```

### Server Components

All pages are React Server Components by default:
- Can directly query database
- No client-side JavaScript by default
- Better performance and SEO

### Server Actions

Forms use server actions for mutations:
- Type-safe with TypeScript
- Automatic revalidation
- Built-in error handling

---

## Best Practices

### 1. Database Queries

- Always use the service layer
- Include only necessary relations
- Use Prisma's type safety

### 2. Forms

- Follow the established form pattern
- Use Zod for validation
- Provide clear error messages
- Show loading states

### 3. Navigation

- Use breadcrumb-style navigation
- Provide "Back" buttons
- Show parent context (e.g., shared context)

### 4. Error Handling

- Catch errors in try-catch blocks
- Return user-friendly error messages
- Log errors for debugging
- Use `notFound()` for 404 errors

### 5. Revalidation

- Always revalidate after mutations
- Revalidate parent pages when appropriate
- Use specific paths, not wildcards

---

## Future Enhancements

Potential features to add:

1. **User Management**
   - User-specific projects
   - Team collaboration
   - Role-based access control

2. **Version History**
   - Track changes to contexts
   - Restore previous versions
   - Audit trail

3. **Rich Text Editor**
   - WYSIWYG markdown editor
   - Live preview
   - Syntax highlighting

4. **Search & Filtering**
   - Full-text search
   - Filter by project/task
   - Tag system

5. **Export/Import**
   - Export to markdown files
   - Import from existing markdown
   - Bulk operations

6. **MCP Enhancements**
   - Subscribe to changes
   - Batch operations
   - Advanced querying

---

## Troubleshooting

### Common Issues

**TypeScript Errors:**
- Run `npm run db:generate` after schema changes
- Restart TypeScript server in IDE

**Database Connection:**
- Ensure PostgreSQL is running: `npm run db:start`
- Check `DATABASE_URL` in `.env`

**Migration Issues:**
- Use `npx prisma migrate reset` (WARNING: deletes data)
- Or manually fix in database and run `npx prisma db pull`

**Form Validation:**
- Check Zod schema matches form fields
- Verify field names in form config

---

## Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

---

## License

[Your License Here]
- I want you to only commit and push changes if I explicitly tell you to do so. Always use the github cli for all github related actions