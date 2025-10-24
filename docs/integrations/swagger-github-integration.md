# Swagger/OpenAPI GitHub Integration

Connect projects to GitHub repositories containing Swagger/OpenAPI specifications to automatically fetch and parse API endpoints.

## Setup

### Configure GitHub Access Token

Add to your `.env` file:

```env
GITHUB_TOKEN=your_github_personal_access_token
```

**Creating a token:**

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Copy the token and add to `.env`

### Add Repository to Project

When creating/editing a project:

- **GitHub Repository**: Format `owner/repo` (e.g., `mycompany/backend-api`)
- **Swagger Path**: Path to file (e.g., `docs/openapi.yaml`)

## Usage

### Fetch Endpoints

```typescript
import { fetchProjectSwaggerEndpoints } from "@/lib/actions/swagger-actions";

const result = await fetchProjectSwaggerEndpoints(projectId);
const endpoints = result?.endpoints || [];
```

### Form Component

```typescript
import { FormSwaggerEndpointSelector } from "@/components/forms/fields";

<FormSwaggerEndpointSelector
  name="endpoint"
  fieldConfig={{ label: "API Endpoint" }}
  endpoints={endpoints}
  loading={loading}
/>
```

Value stored as `"METHOD:PATH"` (e.g., `"GET:/api/users"`).

### API Routes

```bash
# Test any repository
GET /api/swagger/test?repo=owner/repo&path=docs/swagger.yaml

# Fetch project endpoints
GET /api/swagger/{projectId}
GET /api/swagger/{projectId}?search=users
```

## Features

- ✅ OpenAPI 3.x and Swagger 2.x (YAML/JSON)
- ✅ Searchable dropdown with method badges
- ✅ Groups endpoints by tags
- ✅ React-hook-form integration
- ✅ Console logging

## Components

**Service:** `SwaggerService` - Fetches from GitHub, parses OpenAPI/Swagger

**Actions:**

- `fetchProjectSwaggerEndpoints(projectId)`
- `fetchSwaggerEndpoints(repo, path, branch?)`
- `searchProjectEndpoints(projectId, query)`

**UI Components:**

- `SwaggerEndpointSelector` - Standalone dropdown
- `FormSwaggerEndpointSelector` - Form-integrated version

## Demo

See live demos on home page after login.

## Troubleshooting

**403 Forbidden:** Add `GITHUB_TOKEN` to `.env`

**Parse errors:** Validate at [editor.swagger.io](https://editor.swagger.io/)
