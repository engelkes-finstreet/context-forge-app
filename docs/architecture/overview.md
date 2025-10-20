# Architecture Overview

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS 4
- **Forms**: React Hook Form + Zod validation
- **Backend**: Next.js Server Actions & API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better-auth

## Architecture Diagram

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

## Architectural Layers

### 1. Presentation Layer (Web UI)

- Next.js App Router pages
- React Server Components
- Client components for interactivity
- Form-based interfaces with validation

### 2. API Layer

- Server Actions for mutations
- API Routes for MCP server
- Type-safe with TypeScript
- Automatic revalidation

### 3. Service Layer

- Business logic encapsulation
- Database query abstraction
- Reusable operations
- Type-safe interfaces

### 4. Data Access Layer

- Prisma ORM
- Type-safe database queries
- Migration management
- Relation handling

### 5. Database Layer

- PostgreSQL
- Structured schema with relations
- Cascading operations
- Data integrity constraints
