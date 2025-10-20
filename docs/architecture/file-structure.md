# File Structure

## Application Directory Layout

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

## Key Directories

### `/app` - Next.js Application Routes

Contains all application pages and API routes using Next.js 15 App Router conventions.

**Subdirectories:**
- `(authenticated)/` - Protected routes requiring authentication
- `api/` - API endpoints (MCP server)

### `/features` - Feature-based Components

Organized by feature domain (projects, tasks, subtasks). Each feature contains:
- Form components
- Display components
- Feature-specific utilities

### `/lib` - Shared Libraries

Core application logic and utilities:
- **actions/** - Server actions for form handling
- **services/** - Business logic layer
- **validations/** - Zod schemas for input validation
- **mcp/** - MCP server utilities and types

### `/components` - Shared UI Components

Reusable UI components (primarily shadcn/ui).

## Naming Conventions

### Files

- **Pages**: `page.tsx` (Next.js convention)
- **Layouts**: `layout.tsx` (Next.js convention)
- **API Routes**: `route.ts` (Next.js convention)
- **Components**: `kebab-case.tsx` (e.g., `project-list.tsx`)
- **Services**: `kebab-case-service.ts` (e.g., `project-service.ts`)
- **Actions**: `kebab-case-actions.ts` (e.g., `project-actions.ts`)
- **Schemas**: `kebab-case-schema.ts` (e.g., `project-schema.ts`)

### Directories

- Feature directories: `kebab-case` (e.g., `projects/`, `tasks/`)
- Component groups: `kebab-case` (e.g., `forms/`, `type-selector/`)
