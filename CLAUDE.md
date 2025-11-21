# Context Forge - Documentation

## Overview

Context Forge is a full-stack Next.js application designed to manage AI agent tasks and contexts. It provides a structured way to organize projects, tasks, and subtasks with shared contexts that can be accessed and modified by Claude Code through an integrated MCP (Model Context Protocol) server.

### Key Features

- **Project Management**: Organize work into distinct projects
- **Task Hierarchy**: Tasks with shared context accessible by all subtasks
- **Subtask Management**: Individual subtasks with their own content
- **Typed Subtask System**: Different subtask types with specialized behavior
- **Form-based UI**: Validated forms with markdown support
- **MCP Server Integration**: Claude Code can read/update contexts directly from the database

## Documentation

All detailed documentation is organized in the [`docs/`](./docs/) directory.

### 📚 Documentation Index

#### Architecture & Structure

- [Architecture Overview](./docs/architecture/overview.md) - Tech stack and system design
- [File Structure](./docs/architecture/file-structure.md) - Directory layout and conventions

#### Database

- [Database Schema](./docs/database/schema.md) - Models, relationships, and key features
- [Database Setup](./docs/database/setup.md) - Configuration, migrations, and commands

#### Features

- [Projects](./docs/features/projects.md) - Project management
- [Tasks](./docs/features/tasks.md) - Task management with shared context
- [Subtasks](./docs/features/subtasks.md) - Individual work items
- [Typed Subtasks](./docs/features/typed-subtasks.md) - Two-layer validation system for type-specific subtasks

#### Development Patterns

- [Forms](./docs/patterns/forms.md) - Form configuration and validation patterns
- [Routing](./docs/patterns/routing.md) - Type-safe routing system
- [Services](./docs/patterns/services.md) - Business logic layer patterns
- [Server Actions](./docs/patterns/server-actions.md) - Form submission handling
- [Validation](./docs/patterns/validation.md) - Zod schema patterns

#### Integrations

- [MCP Server](./docs/integrations/mcp-server.md) - Model Context Protocol server for Claude Code

#### Guides

- [Development Setup](./docs/guides/development-setup.md) - Get started with development
- [Next.js 15 Patterns](./docs/guides/nextjs-15-patterns.md) - Next.js 15 specific patterns
- [Best Practices](./docs/guides/best-practices.md) - Recommended development approaches
- [Troubleshooting](./docs/guides/troubleshooting.md) - Common issues and solutions

#### Planning

- [Future Enhancements](./docs/planning/future-enhancements.md) - Planned features and improvements

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npm run db:generate
npm run db:migrate

# Start development server
npm run dev
```

Visit [Development Setup](./docs/guides/development-setup.md) for detailed instructions.

## Key Concepts

### Shared Context

Tasks have a `sharedContext` field (markdown) that all subtasks can access. This provides common information without duplication.

### Typed Subtask System

Context Forge implements a **two-layer validation system**:

- **Form Schemas**: Define user input (type-specific fields)
- **Database Schemas**: Define what gets stored (unified structure)
- **Server Actions**: Transform form data to database data

See [Typed Subtasks](./docs/features/typed-subtasks.md) for comprehensive documentation.

### Service Layer

All business logic is encapsulated in service classes:

```typescript
export class ProjectService {
  static async getAll() {
    /* ... */
  }
  static async getById(id: string) {
    /* ... */
  }
  static async create(data: CreateInput) {
    /* ... */
  }
  // ...
}
```

### Type-Safe Routing

All routes are defined in a centralized, type-safe system that provides compile-time validation:

```typescript
import { routes, TypedLink } from '@/lib/routes';

// Type-safe navigation with autocomplete and validation
<TypedLink route={routes.projects.detail} params={{ projectId: '123' }}>
  View Project
</TypedLink>

// TypeScript error if params are missing or incorrect
routes.projects.detail.path({ projectId: '123' }); // ✓
routes.projects.detail.path(); // ✗ Error: projectId required
```

See [Routing](./docs/patterns/routing.md) for comprehensive documentation.

### MCP Integration

Claude Code can interact with Context Forge through the MCP server:

- **List Resources**: Discover all tasks and subtasks
- **Read Resource**: Access task/subtask content
- **Update Resource**: Modify content programmatically

See [MCP Server](./docs/integrations/mcp-server.md) for API documentation.

## Common Commands

### Development

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run type-check       # Run TypeScript type checking
npm run lint             # Run ESLint
```

### Database

```bash
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes (dev)
npm run db:migrate       # Create and run migration
npm run db:studio        # Open Prisma Studio
npx prisma migrate reset # Reset database (deletes data!)
```

## Project Structure

```
context-forge-app/
├── docs/                    # Documentation (you are here!)
├── src/
│   ├── app/                 # Next.js pages and API routes
│   ├── components/          # Shared UI components
│   ├── features/            # Feature-specific components
│   └── lib/                 # Utilities, services, actions
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Migration files
├── CLAUDE.md               # This file
└── package.json
```

## Common Tasks

### Create a New Feature

1. Follow the [Form Pattern](./docs/patterns/forms.md)
2. Create service in `src/lib/services/`
3. Create server actions in `src/lib/actions/`
4. Create validation schema in `src/lib/validations/`
5. Create form components in `src/features/`

### Add a New Subtask Type

Follow the step-by-step guide in [Typed Subtasks](./docs/features/typed-subtasks.md#how-to-add-a-new-subtask-type).

### Run Database Migrations

See [Database Setup](./docs/database/setup.md#database-migrations).

## Troubleshooting

Having issues? Check the [Troubleshooting Guide](./docs/guides/troubleshooting.md) for common problems and solutions.

## Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

## License

[Your License Here]

---

**Note:** For detailed documentation on any topic, please refer to the files in the [`docs/`](./docs/) directory. This file serves as a quick reference and index to the full documentation.

- Stop to write everything into some markdown files if I do not explicitly ask you. If you want to add a short explanation do it inside the console but stop creating markdown files
- You never use the pnpm or npm run command. I am doing this on my own in a separate terminal. Same for pnpm or npm build. This is not needed for you. I will do this on each commit on my own

## Development Guidelines

### JSX Quotes and Special Characters

When working with quotes and special characters in JSX text content, always use HTML entities to satisfy the `react/no-unescaped-entities` ESLint rule:

**Use HTML entities for quotes:**
- `&quot;` for double quotes (")
- `&apos;` or `&#39;` for apostrophes (')
- `&ldquo;` and `&rdquo;` for curly quotes (" ")

**Example:**
```tsx
// ✅ Correct - Use HTML entities
<AlertDescription>
  Update the status to &quot;Open&quot; first.
</AlertDescription>

// ❌ Incorrect - Unescaped quotes
<AlertDescription>
  Update the status to "Open" first.
</AlertDescription>
```

**Why this matters:**
- Prevents linting errors and build failures
- Ensures proper HTML compliance
- Improves accessibility for screen readers
- Avoids potential parsing edge cases
- Consistent with React and HTML best practices
