# Database Schema

## Entity Relationships

```
Project (1) ──────< Task (n)
                     │
                     └──────< Subtask (n)
```

## Models

### Project

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

**Fields:**
- `id` - Unique identifier (CUID)
- `name` - Project name (required)
- `description` - Optional project description
- `createdAt` - Automatic timestamp when created
- `updatedAt` - Automatic timestamp when modified
- `tasks` - One-to-many relation with Task

### Task

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

**Fields:**
- `id` - Unique identifier (CUID)
- `projectId` - Foreign key to Project
- `name` - Task name (required)
- `sharedContext` - Markdown content accessible by all subtasks
- `order` - Display order (default: 0)
- `createdAt` - Automatic timestamp when created
- `updatedAt` - Automatic timestamp when modified
- `project` - Many-to-one relation with Project
- `subtasks` - One-to-many relation with Subtask

### Subtask

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

**Fields:**
- `id` - Unique identifier (CUID)
- `taskId` - Foreign key to Task
- `name` - Subtask name (required)
- `content` - Markdown content for this subtask
- `order` - Display order (default: 0)
- `createdAt` - Automatic timestamp when created
- `updatedAt` - Automatic timestamp when modified
- `task` - Many-to-one relation with Task

## Key Features

### Cascading Deletes

Deleting a project removes all associated tasks and subtasks automatically.

```
DELETE Project → CASCADE → DELETE Tasks → CASCADE → DELETE Subtasks
```

### Ordering

Tasks and subtasks maintain an `order` field for consistent display ordering.

### Shared Context

Tasks have a `sharedContext` field that all subtasks can access. This provides common context for related work items.

### Automatic Timestamps

All models automatically track:
- `createdAt` - Set when record is created
- `updatedAt` - Updated whenever record is modified

### Typed Subtasks

Subtasks support a `type` field for different subtask types:
- `GENERIC` - Standard subtask (implemented)
- `FORM` - Form-based subtask (planned)
- `MODAL` - Modal dialog subtask (planned)
- `INQUIRY_PROCESS` - Multi-step wizard (planned)

Each type can have associated metadata stored as JSON.
