# Typed Subtask System

## Overview

Context Forge implements a **two-layer validation system** that separates user input (forms) from database storage (Prisma). This architecture enables type-specific forms with different fields while maintaining type safety throughout the application.

## Core Principles

1. **Form Schemas** define what users input (type-specific fields)
2. **Database Schemas** define what gets stored (unified structure)
3. **Server Actions** transform form data → database data
4. **Type System** ensures compile-time safety with discriminated unions

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Input Layer                     │
│         (Form Schemas - Type-Specific Fields)           │
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
│                                                         │
│  All types share common structure:                     │
│  - type: SubtaskType                                    │
│  - metadata: type-specific JSON                         │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
               [PostgreSQL Database]

* Future enhancement for non-Generic types
```

## Data Flow

1. **User fills form** with type-specific fields
2. **Form validates** using type-specific Zod schema
3. **Server action** transforms form data to database format
4. **Database stores** in unified structure with type and metadata
5. **Application reads** and interprets based on type

## Subtask Types

| Type | Status | Description |
|------|--------|-------------|
| `GENERIC` | ✅ Implemented | Standard subtask with name & content |
| `INQUIRY_PROCESS` | 🔄 Planned | Multi-step form wizard |
| `FORM` | 🔄 Planned | Single form with field definitions |
| `MODAL` | 🔄 Planned | Modal dialog component |

## File Organization

```
src/
├── lib/validations/
│   ├── subtask-schema.ts                    # Database schemas (unified)
│   └── forms/                               # Form schemas (type-specific)
│       ├── generic-subtask-form-schema.ts
│       └── [other-type]-form-schema.ts     # Future types
│
├── lib/actions/
│   └── subtask-actions.ts                   # Type-specific actions
│
├── features/subtasks/
│   ├── types/
│   │   └── subtask-types.ts                 # TypeScript types & metadata
│   ├── config/
│   │   └── type-config.ts                   # UI config (icons, labels, routes)
│   └── components/
│       ├── type-selector/                   # Type selection UI
│       └── forms/                           # Type-specific form components
│           ├── generic-subtask/
│           └── [other-type]/               # Future types
```

## How to Add a New Subtask Type

**High-Level Steps:**

1. **Enable the type** in `src/features/subtasks/config/type-config.ts`
2. **Create form schema** in `src/lib/validations/forms/[type]-subtask-form-schema.ts`
3. **Create server action** in `src/lib/actions/subtask-actions.ts`
4. **Create form components** in `src/features/subtasks/components/forms/[type]/`
5. **Create route** in `src/app/(authenticated)/.../subtasks/new/[type]/page.tsx`

See existing Generic type implementation for reference.

## Key Benefits

✅ **Separation of Concerns**: Form validation ≠ Database validation
✅ **Type Safety**: Compile-time checks prevent invalid metadata
✅ **Extensibility**: Easy to add new types without breaking existing ones
✅ **Flexibility**: Each type has custom form fields tailored to its needs
✅ **Clean Architecture**: Clear data flow from user → form → action → database
✅ **Future-Proof**: Ready for AI content generation or other transformations

## Type Immutability

Once created, a subtask's type **cannot be changed**. This ensures:
- Metadata always matches the type
- No invalid state combinations
- Simpler migration logic
- Clearer user expectations

## Metadata Storage

Type-specific configuration is stored as JSON in the `metadata` field:
- **GENERIC**: `null` (no metadata needed)
- **FORM**: Field definitions, endpoints, button text (planned)
- **MODAL**: Size, trigger behavior, close actions (planned)
- **INQUIRY_PROCESS**: Steps, progress config (planned)
