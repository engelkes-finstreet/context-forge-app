# Swagger/OpenAPI GitHub Integration - Quick Start

This document provides a quick overview of the new Swagger/OpenAPI GitHub integration feature.

## What's New

Projects can now be connected to GitHub repositories containing Swagger/OpenAPI files. The system can:
- Fetch swagger files from GitHub repositories
- Parse OpenAPI/Swagger specifications (both 2.x and 3.x)
- Extract all API endpoints with metadata
- Log all available routes to the console

## Quick Test

### Option 1: Test with Any Public Repository

Use the test API endpoint:

```bash
# Example with a public swagger file
curl "http://localhost:3000/api/swagger/test?repo=owner/repo&path=docs/swagger.yaml"
```

### Option 2: Test with a Project

1. **Create a project** with GitHub integration:
   - Navigate to `/projects/new`
   - Fill in the project details
   - Add GitHub Repository (format: `owner/repo`)
   - Add Swagger Path (e.g., `docs/swagger.yaml`)
   - Submit the form

2. **Fetch endpoints** via API:
   ```bash
   curl http://localhost:3000/api/swagger/{projectId}
   ```

3. **Check the console** - all endpoints will be logged in a formatted view

### Option 3: Use Server Actions in Code

```typescript
import { fetchProjectSwaggerEndpoints } from "@/lib/actions/swagger-actions";

const result = await fetchProjectSwaggerEndpoints(projectId);
console.log(result?.endpoints);
```

## What Was Added

### Database Schema
- Added `githubRepo` field to Project model
- Added `swaggerPath` field to Project model

### New Services
- `SwaggerService` (`src/lib/services/swagger-service.ts`)
  - Fetches files from GitHub using Octokit
  - Parses Swagger/OpenAPI files
  - Extracts and formats endpoints
  - Provides search and grouping utilities

### New Server Actions
- `fetchProjectSwaggerEndpoints()` - Fetch endpoints for a project
- `fetchSwaggerEndpoints()` - Fetch from any repository
- `searchProjectEndpoints()` - Search project endpoints

### New API Routes
- `GET /api/swagger/test` - Test fetching from any repository
- `GET /api/swagger/[projectId]` - Fetch endpoints for a project

### Updated Forms
- Project create/edit forms now include GitHub and Swagger fields

### Dependencies Added
- `@octokit/rest` - GitHub API client
- `swagger-parser` - OpenAPI/Swagger parser
- `js-yaml` - YAML parsing
- `@types/js-yaml` - TypeScript types
- `@types/swagger-parser` - TypeScript types

## Example Output

When you fetch endpoints, they are logged to the console:

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

================================================================================

📚 Endpoints grouped by tag:

  Users (15 endpoints):
    GET     /api/users
    POST    /api/users
    GET     /api/users/{id}
    ...

  Auth (8 endpoints):
    POST    /api/auth/login
    POST    /api/auth/register
    ...
```

## React Hook Form Integration ✅

The searchable endpoint selector is now integrated with react-hook-form! See the demo on the home page.

### Usage in Forms

```typescript
import { FormSwaggerEndpointSelector } from '@/components/forms/fields/form-swagger-endpoint-selector';

<FormSwaggerEndpointSelector
  name="endpoint"
  fieldConfig={{
    label: "API Endpoint",
    description: "Select the endpoint for this request",
    placeholder: "Select an endpoint...",
  }}
  endpoints={endpoints}
  loading={loading}
/>
```

The component stores endpoints as strings (e.g., `"GET:/api/users"`) for easy serialization.

**See full documentation:** [React Hook Form Integration Guide](./docs/integrations/swagger-react-hook-form.md)

## Next Steps (Future Enhancements)

- ✅ ~~Add a searchable dropdown in subtask forms to select endpoints~~
- Integrate endpoint selector into subtask creation forms
- Cache parsed endpoints to reduce API calls
- Add UI to view and explore endpoints
- Support for multiple branches
- Webhook integration for auto-updates

## Migration

A database migration was created:
```
prisma/migrations/20251021130908_add_github_swagger_to_project/migration.sql
```

To apply it:
```bash
npm run db:migrate
```

## Documentation

Full documentation is available at:
- [Swagger GitHub Integration](./docs/integrations/swagger-github-integration.md)

## Testing Example Repositories

Here are some public repositories you can test with:

1. **Swagger Petstore** (example)
   - Repo: `swagger-api/swagger-petstore`
   - Path: `src/main/resources/openapi.yaml`

2. **GitHub REST API**
   - Many open-source projects include swagger files in their docs

## Troubleshooting

- Ensure the repository format is `owner/repo` (not a full URL)
- For private repos, add `GITHUB_TOKEN` to your `.env` file
- Check that the swagger path is correct (include file extension)
- Validate your swagger file is valid OpenAPI/Swagger format

---

For detailed API reference and usage examples, see the [full documentation](./docs/integrations/swagger-github-integration.md).
