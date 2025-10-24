# MCP Server Integration

## Overview

The MCP (Model Context Protocol) server allows Claude Code to interact with Context Forge data programmatically. It provides a read/write API for accessing tasks and subtasks.

## Resource URI Format

```
context-forge://project/{projectId}/task/{taskId}/subtask/{subtaskId}
```

**Examples:**

- Task: `context-forge://project/cm123/task/cm456`
- Subtask: `context-forge://project/cm123/task/cm456/subtask/cm789`

## API Endpoints

### 1. List Resources

Discover all available resources (tasks and subtasks).

**Endpoint:**

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

**Use Case:**
Claude Code can discover all available contexts across all projects.

### 2. Read Resource

Read the markdown content of a task or subtask.

**Endpoint:**

```
POST /api/mcp/read-resource
Content-Type: application/json
```

**Request:**

```json
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

### 3. Update Resource

Update task shared context or subtask content.

**Endpoint:**

```
POST /api/mcp/update-resource
Content-Type: application/json
```

**Request:**

```json
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

**What gets updated:**

- **For tasks**: Updates the `sharedContext` field
- **For subtasks**: Updates the `content` field

## Implementation Files

### Types

**File:** `src/lib/mcp/types.ts`

```typescript
export interface MCPResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

export interface MCPListResourcesResponse {
  resources: MCPResource[];
}

export interface MCPReadResourceRequest {
  uri: string;
}

export interface MCPReadResourceResponse {
  contents: Array<{
    uri: string;
    mimeType: string;
    text: string;
  }>;
}

export interface MCPUpdateResourceRequest {
  uri: string;
  text: string;
}

export interface MCPUpdateResourceResponse {
  success: boolean;
  message: string;
}
```

### Utilities

**File:** `src/lib/mcp/utils.ts`

```typescript
export function parseResourceUri(uri: string): {
  projectId: string;
  taskId: string;
  subtaskId?: string;
} | null;

export function buildResourceUri(
  projectId: string,
  taskId: string,
  subtaskId?: string,
): string;

export function formatTaskAsMarkdown(task: Task): string;

export function formatSubtaskAsMarkdown(subtask: Subtask, task: Task): string;
```

### API Routes

**Files:**

- `src/app/api/mcp/list-resources/route.ts`
- `src/app/api/mcp/read-resource/route.ts`
- `src/app/api/mcp/update-resource/route.ts`

## Usage Examples

### List All Resources

```typescript
const response = await fetch("/api/mcp/list-resources");
const { resources } = await response.json();

console.log(resources);
// [
//   {
//     uri: "context-forge://project/cm1/task/cm2",
//     name: "My Project / Task 1",
//     description: "Task in My Project with 2 subtask(s)",
//     mimeType: "text/markdown"
//   },
//   ...
// ]
```

### Read a Subtask

```typescript
const response = await fetch("/api/mcp/read-resource", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    uri: "context-forge://project/cm1/task/cm2/subtask/cm3",
  }),
});

const { contents } = await response.json();
console.log(contents[0].text);
// # Subtask Name
//
// ## Shared Context (from parent task)
// ...
//
// ## Content
// ...
```

### Update a Task

```typescript
const response = await fetch("/api/mcp/update-resource", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    uri: "context-forge://project/cm1/task/cm2",
    text: "# Updated Task\n\n## Shared Context\n\nNew context...",
  }),
});

const result = await response.json();
console.log(result.message);
// "Task shared context updated successfully"
```

## URI Parsing

The MCP server parses resource URIs to extract IDs:

```typescript
const uri = "context-forge://project/cm1/task/cm2/subtask/cm3";

const parsed = parseResourceUri(uri);
// {
//   projectId: 'cm1',
//   taskId: 'cm2',
//   subtaskId: 'cm3'
// }
```

## Markdown Generation

### Task Markdown

```typescript
const task = await TaskService.getById(taskId);
const markdown = formatTaskAsMarkdown(task);

// # Task Name
//
// ## Shared Context
//
// {sharedContext content}
```

### Subtask Markdown

```typescript
const subtask = await SubtaskService.getById(subtaskId);
const task = await TaskService.getById(subtask.taskId);
const markdown = formatSubtaskAsMarkdown(subtask, task);

// # Subtask Name
//
// ## Shared Context (from parent task)
//
// {task.sharedContext content}
//
// ## Content
//
// {subtask.content}
```

## Error Handling

### Invalid URI

```json
{
  "error": "Invalid resource URI format"
}
```

### Resource Not Found

```json
{
  "error": "Task not found"
}
```

### Update Failure

```json
{
  "error": "Failed to update subtask content"
}
```

## Security Considerations

### Authentication

Currently, the MCP server is unauthenticated. Consider adding:

- API key authentication
- Token-based authentication
- IP whitelisting

### Rate Limiting

Implement rate limiting to prevent abuse:

- Per-IP limits
- Per-API key limits
- Global limits

### Validation

All inputs are validated:

- URI format validation
- Content validation
- ID validation (CUID format)

## Claude Code Integration

### Setup

Configure Claude Code to use Context Forge MCP server:

```json
{
  "mcp": {
    "servers": {
      "context-forge": {
        "url": "http://localhost:3000/api/mcp"
      }
    }
  }
}
```

### Usage

Claude Code can:

1. **List resources** to discover available contexts
2. **Read resources** to access task/subtask content
3. **Update resources** to modify content during work

### Workflow

1. User asks Claude Code to work on a subtask
2. Claude Code lists resources to find relevant subtask
3. Claude Code reads the subtask (including shared context)
4. Claude Code performs work
5. Claude Code updates the subtask with results

## Future Enhancements

### Planned Features

1. **Subscriptions**: Real-time updates when resources change
2. **Batch Operations**: Read/update multiple resources at once
3. **Advanced Querying**: Filter and search resources
4. **Metadata**: Include timestamps, user info, etc.
5. **Versioning**: Track content history

### Possible Improvements

- GraphQL API for more flexible queries
- WebSocket support for real-time updates
- Pagination for large resource lists
- Caching for improved performance
