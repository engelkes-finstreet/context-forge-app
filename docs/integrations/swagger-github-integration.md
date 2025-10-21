# Swagger/OpenAPI GitHub Integration

This feature allows you to connect projects to GitHub repositories containing Swagger/OpenAPI specification files. Once connected, you can fetch and parse all available API endpoints, which can be used for creating subtasks that reference specific backend endpoints.

## Overview

The integration provides:
- **GitHub Repository Connection**: Link projects to GitHub repos
- **Swagger File Parsing**: Automatically parse OpenAPI/Swagger YAML or JSON files
- **Endpoint Discovery**: Extract all API endpoints with their methods, paths, and metadata
- **Search & Filter**: Search through endpoints by path, method, tags, or description
- **Grouped Display**: View endpoints organized by tags

## Setup

### 1. Add GitHub Repository to Project

When creating or editing a project, you can now specify:

- **GitHub Repository**: The repository in `owner/repo` format (e.g., `octocat/hello-world`)
- **Swagger Path**: The path to the swagger file in the repository (e.g., `docs/swagger.yaml` or `api/openapi.json`)

Both fields are optional, but you need both to fetch endpoints.

### 2. GitHub Authentication (Optional)

For public repositories, no authentication is required. For private repositories, you need to:

1. Create a GitHub Personal Access Token with `repo` scope
2. Add it to your `.env` file:
   ```
   GITHUB_TOKEN=your_token_here
   ```

The SwaggerService will automatically use this token if available.

## Usage

### Using Server Actions

```typescript
import { fetchProjectSwaggerEndpoints } from "@/lib/actions/swagger-actions";

// Fetch endpoints for a project
const result = await fetchProjectSwaggerEndpoints(projectId);

if (result?.error) {
  console.error(result.error);
} else {
  console.log(`Found ${result?.endpoints?.length} endpoints`);
  result?.endpoints?.forEach((endpoint) => {
    console.log(`${endpoint.method} ${endpoint.path}`);
  });
}
```

### Using SwaggerService Directly

```typescript
import { SwaggerService } from "@/lib/services/swagger-service";

// Fetch from GitHub
const endpoints = await SwaggerService.getEndpointsFromGitHub(
  "owner/repo",
  "docs/swagger.yaml"
);

// Search endpoints
const filtered = SwaggerService.searchEndpoints(endpoints, "user");

// Group by tags
const grouped = SwaggerService.groupEndpointsByTag(endpoints);
```

### Using API Routes

#### Test any GitHub repository:
```bash
GET /api/swagger/test?repo=owner/repo&path=docs/swagger.yaml
```

Optional query parameters:
- `branch`: Specify a branch (default: `main`)

#### Fetch endpoints for a project:
```bash
GET /api/swagger/{projectId}
```

Optional query parameters:
- `search`: Filter endpoints by search query

Example:
```bash
# Fetch all endpoints for project
curl http://localhost:3000/api/swagger/cm2abc123xyz

# Search for user-related endpoints
curl http://localhost:3000/api/swagger/cm2abc123xyz?search=user
```

## API Reference

### SwaggerService

#### Methods

##### `fetchSwaggerFromGitHub(githubRepo, swaggerPath, branch?)`
Fetches the raw swagger file content from GitHub.

**Parameters:**
- `githubRepo` (string): Repository in format "owner/repo"
- `swaggerPath` (string): Path to swagger file in the repository
- `branch` (string, optional): Branch name (default: "main")

**Returns:** Promise<string> - Raw file content

**Throws:** Error if repository format is invalid or file cannot be fetched

##### `parseSwaggerEndpoints(swaggerContent)`
Parses swagger/OpenAPI content and extracts all endpoints.

**Parameters:**
- `swaggerContent` (string): Raw swagger/OpenAPI content (YAML or JSON)

**Returns:** Promise<SwaggerEndpoint[]>

**Throws:** Error if parsing fails

##### `getEndpointsFromGitHub(githubRepo, swaggerPath, branch?)`
Fetches and parses swagger file in one step.

**Parameters:**
- `githubRepo` (string): Repository in format "owner/repo"
- `swaggerPath` (string): Path to swagger file
- `branch` (string, optional): Branch name (default: "main")

**Returns:** Promise<SwaggerEndpoint[]>

##### `searchEndpoints(endpoints, query)`
Searches endpoints by path, method, description, or tags.

**Parameters:**
- `endpoints` (SwaggerEndpoint[]): Array of endpoints to search
- `query` (string): Search query

**Returns:** SwaggerEndpoint[] - Filtered endpoints

##### `groupEndpointsByTag(endpoints)`
Groups endpoints by their tags.

**Parameters:**
- `endpoints` (SwaggerEndpoint[]): Array of endpoints

**Returns:** Record<string, SwaggerEndpoint[]> - Endpoints grouped by tag

##### `formatEndpoints(endpoints)`
Formats endpoints for display/logging.

**Parameters:**
- `endpoints` (SwaggerEndpoint[]): Array of endpoints

**Returns:** string - Formatted string representation

### SwaggerEndpoint Type

```typescript
interface SwaggerEndpoint {
  path: string;           // e.g., "/api/users/{id}"
  method: string;         // e.g., "GET", "POST"
  summary?: string;       // Brief description
  description?: string;   // Detailed description
  operationId?: string;   // Unique operation identifier
  tags?: string[];        // Category tags
}
```

### Server Actions

#### `fetchProjectSwaggerEndpoints(projectId)`
Fetches and logs swagger endpoints for a project.

**Parameters:**
- `projectId` (string): The project ID

**Returns:** Promise<SwaggerActionState>
```typescript
type SwaggerActionState = {
  error: string | null;
  endpoints: SwaggerEndpoint[] | null;
} | null;
```

#### `fetchSwaggerEndpoints(githubRepo, swaggerPath, branch?)`
Fetches swagger endpoints from any repository.

**Parameters:**
- `githubRepo` (string): Repository in format "owner/repo"
- `swaggerPath` (string): Path to swagger file
- `branch` (string, optional): Branch name

**Returns:** Promise<SwaggerActionState>

#### `searchProjectEndpoints(projectId, query)`
Searches endpoints from a project.

**Parameters:**
- `projectId` (string): The project ID
- `query` (string): Search query

**Returns:** Promise<SwaggerActionState>

## Example Workflow

1. **Create a Project** with GitHub integration:
   ```
   Name: My API Project
   GitHub Repo: myorg/backend-api
   Swagger Path: docs/openapi.yaml
   ```

2. **Fetch Endpoints** (via API or server action):
   ```bash
   curl http://localhost:3000/api/swagger/{projectId}
   ```

3. **View Console Output**: The server will log all endpoints in a formatted view:
   ```
   ================================================================================
   Swagger Endpoints for Project: My API Project
   GitHub Repo: myorg/backend-api
   Swagger Path: docs/openapi.yaml
   Total Endpoints: 42
   ================================================================================

   GET     /api/users
     Summary: Get all users
     Tags: Users

   POST    /api/users
     Summary: Create a new user
     Tags: Users

   GET     /api/users/{id}
     Summary: Get user by ID
     Tags: Users
   ...
   ```

4. **Use in Subtasks** (future enhancement): When creating subtasks, you'll be able to select from a dropdown of these endpoints.

## Supported Formats

- OpenAPI 3.x (YAML or JSON)
- Swagger 2.x (YAML or JSON)

## Error Handling

The integration includes comprehensive error handling:

- Invalid repository format
- Repository or file not found
- Invalid swagger/OpenAPI format
- Network errors
- Parsing errors

All errors are logged and returned in a structured format.

## Future Enhancements

- **Endpoint Selector UI**: Searchable dropdown in subtask forms
- **Endpoint Caching**: Cache parsed endpoints to reduce API calls
- **Multiple Branches**: Support for selecting different branches per project
- **Endpoint Details**: View full endpoint details including parameters, responses
- **Auto-sync**: Automatically update endpoints when swagger file changes
- **Webhook Support**: Trigger updates on repository changes

## Troubleshooting

### "Failed to fetch swagger file from GitHub: 403 Forbidden"
- The repository might be private. Add a GitHub token to your `.env` file
- Check that the repository and file path are correct

### "Failed to parse swagger file"
- Ensure the file is valid OpenAPI/Swagger format
- Check that the file path is correct (including file extension)
- Validate your swagger file at [swagger.io/tools/swagger-editor](https://editor.swagger.io/)

### "Project does not have a GitHub repository configured"
- Make sure both `githubRepo` and `swaggerPath` are set for the project
- Edit the project and add the missing fields

## Related Documentation

- [Projects](../features/projects.md)
- [Subtasks](../features/subtasks.md)
- [Server Actions](../patterns/server-actions.md)
- [Services](../patterns/services.md)
