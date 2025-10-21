# Swagger Endpoint Selector - React Hook Form Integration

This guide explains how to use the `FormSwaggerEndpointSelector` component with react-hook-form in your forms.

## Overview

The `FormSwaggerEndpointSelector` is a form-integrated version of the `SwaggerEndpointSelector` component that works seamlessly with react-hook-form. It handles the serialization and deserialization of endpoint data automatically.

## How It Works

### Value Storage

The component stores endpoints as a string in the following format:
```
METHOD:PATH
```

**Examples:**
- `"GET:/api/users"`
- `"POST:/api/users"`
- `"DELETE:/api/users/{id}"`

This format is:
- ✅ Easy to serialize in forms
- ✅ Works with Zod validation
- ✅ Can be stored in databases
- ✅ Simple to parse and reconstruct

### Encoding/Decoding

The component provides helper functions for working with endpoint values:

```typescript
import { encodeEndpoint, decodeEndpoint } from '@/components/forms/fields/form-swagger-endpoint-selector';

// Encode a SwaggerEndpoint to a string
const value = encodeEndpoint(endpoint);
// "GET:/api/users"

// Decode a string back to a SwaggerEndpoint
const endpoint = decodeEndpoint(value, endpoints);
// { method: "GET", path: "/api/users", summary: "...", ... }
```

## Basic Usage

### 1. Define Your Form Schema

```typescript
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  endpoint: z.string().min(1, "Please select an endpoint"),
});

type FormValues = z.infer<typeof formSchema>;
```

### 2. Set Up React Hook Form

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: "",
    description: "",
    endpoint: "",
  },
});
```

### 3. Fetch Endpoints

```typescript
import { fetchProjectSwaggerEndpoints } from "@/lib/actions/swagger-actions";

const [endpoints, setEndpoints] = React.useState<SwaggerEndpoint[]>([]);
const [loading, setLoading] = React.useState(false);

React.useEffect(() => {
  async function loadEndpoints() {
    setLoading(true);
    const result = await fetchProjectSwaggerEndpoints(projectId);
    if (result?.endpoints) {
      setEndpoints(result.endpoints);
    }
    setLoading(false);
  }
  loadEndpoints();
}, [projectId]);
```

### 4. Use the Component in Your Form

```typescript
import { Form } from "@/components/ui/form";
import { FormSwaggerEndpointSelector } from "@/components/forms/fields/form-swagger-endpoint-selector";

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormSwaggerEndpointSelector
      name="endpoint"
      fieldConfig={{
        label: "API Endpoint",
        description: "Select the API endpoint for this request",
        placeholder: "Select an endpoint...",
        emptyText: "No endpoints found.",
      }}
      endpoints={endpoints}
      loading={loading}
    />

    <Button type="submit">Submit</Button>
  </form>
</Form>
```

## Complete Example

Here's a full working example:

```typescript
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/forms/fields/form-input";
import { FormSwaggerEndpointSelector } from "@/components/forms/fields/form-swagger-endpoint-selector";
import { fetchProjectSwaggerEndpoints } from "@/lib/actions/swagger-actions";
import type { SwaggerEndpoint } from "@/lib/services/swagger-service";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  endpoint: z.string().min(1, "Please select an endpoint"),
});

type FormValues = z.infer<typeof formSchema>;

export function MyForm({ projectId }: { projectId: string }) {
  const [endpoints, setEndpoints] = React.useState<SwaggerEndpoint[]>([]);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      endpoint: "",
    },
  });

  // Load endpoints when component mounts
  React.useEffect(() => {
    async function loadEndpoints() {
      setLoading(true);
      const result = await fetchProjectSwaggerEndpoints(projectId);
      if (result?.endpoints) {
        setEndpoints(result.endpoints);
      }
      setLoading(false);
    }
    loadEndpoints();
  }, [projectId]);

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    // data.endpoint will be a string like "GET:/api/users"
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          name="name"
          fieldConfig={{
            type: "input",
            label: "Request Name",
            placeholder: "e.g., Get User Profile",
          }}
        />

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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Props Reference

### FormSwaggerEndpointSelector Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | ✓ | The field name in the form |
| `fieldConfig` | `object` | ✓ | Configuration for the form field |
| `endpoints` | `SwaggerEndpoint[]` | ✓ | Array of available endpoints |
| `loading` | `boolean` | | Whether endpoints are being loaded |
| `disabled` | `boolean` | | Whether the selector is disabled |

### FieldConfig Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `label` | `string` | | Label for the form field |
| `description` | `string` | | Help text shown below the field |
| `placeholder` | `string` | | Placeholder text for the selector |
| `emptyText` | `string` | | Text shown when no endpoints match |

## Working with Form Values

### Accessing the Selected Endpoint

After form submission, you'll have the encoded string:

```typescript
const onSubmit = (data: FormValues) => {
  console.log(data.endpoint); // "GET:/api/users"

  // Decode back to full endpoint object if needed
  const endpoint = decodeEndpoint(data.endpoint, endpoints);
  console.log(endpoint);
  // {
  //   method: "GET",
  //   path: "/api/users",
  //   summary: "Get all users",
  //   tags: ["Users"],
  //   ...
  // }
};
```

### Storing in Database

You can store the encoded value directly:

```typescript
// In your Prisma schema
model Subtask {
  id       String  @id
  endpoint String? // Store as "GET:/api/users"
  ...
}

// When saving
await db.subtask.create({
  data: {
    endpoint: formData.endpoint, // "GET:/api/users"
    ...
  },
});
```

### Pre-filling the Form

To pre-fill the form with an existing endpoint:

```typescript
const form = useForm<FormValues>({
  defaultValues: {
    name: subtask.name,
    endpoint: subtask.endpoint || "", // Already in correct format
  },
});
```

Or encode an endpoint object:

```typescript
import { encodeEndpoint } from '@/components/forms/fields/form-swagger-endpoint-selector';

const form = useForm<FormValues>({
  defaultValues: {
    endpoint: encodeEndpoint(selectedEndpoint),
  },
});
```

## Validation

### Zod Schema

```typescript
const schema = z.object({
  // Required endpoint
  endpoint: z.string().min(1, "Please select an endpoint"),

  // Optional endpoint
  endpoint: z.string().optional(),

  // Custom validation
  endpoint: z.string()
    .min(1, "Please select an endpoint")
    .refine(
      (val) => val.startsWith("GET:") || val.startsWith("POST:"),
      "Only GET and POST endpoints are allowed"
    ),
});
```

### Runtime Validation

```typescript
const onSubmit = (data: FormValues) => {
  // Verify the endpoint exists in the current endpoints list
  const endpoint = decodeEndpoint(data.endpoint, endpoints);

  if (!endpoint) {
    toast.error("Selected endpoint is no longer available");
    return;
  }

  // Proceed with submission
  console.log("Valid endpoint:", endpoint);
};
```

## Integration with Subtask Forms

Here's how to integrate this into a subtask creation form:

```typescript
import { FormSwaggerEndpointSelector } from "@/components/forms/fields/form-swagger-endpoint-selector";

// In your subtask form schema
const createSubtaskSchema = z.object({
  taskId: z.string(),
  name: z.string().min(1, "Name is required"),
  content: z.string(),
  endpoint: z.string().optional(), // Optional swagger endpoint
});

// In your subtask form component
export function CreateSubtaskForm({ projectId, taskId }: Props) {
  const [endpoints, setEndpoints] = useState<SwaggerEndpoint[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch endpoints for the project
  useEffect(() => {
    async function loadEndpoints() {
      setLoading(true);
      const result = await fetchProjectSwaggerEndpoints(projectId);
      setEndpoints(result?.endpoints || []);
      setLoading(false);
    }
    loadEndpoints();
  }, [projectId]);

  // ... form setup

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Other fields */}

        <FormSwaggerEndpointSelector
          name="endpoint"
          fieldConfig={{
            label: "API Endpoint (optional)",
            description: "Select the API endpoint this subtask relates to",
            placeholder: "Select an endpoint...",
          }}
          endpoints={endpoints}
          loading={loading}
        />

        {/* Submit button */}
      </form>
    </Form>
  );
}
```

## Styling and Customization

The component inherits all styling from the `SwaggerEndpointSelector` component, including:
- Color-coded HTTP method badges
- Grouped display by tags
- Search functionality
- Loading states
- Error states

You can customize the appearance by modifying the underlying `SwaggerEndpointSelector` component.

## Testing

See the live demo on the home page at `/` (when authenticated) for a working example with:
- Project selection
- Endpoint loading
- Form validation
- Value display
- Submit handling

## Troubleshooting

### Endpoints not showing

1. Ensure the project has `githubRepo` and `swaggerPath` configured
2. Check the console for API errors
3. Verify the swagger file is valid

### Value not updating

1. Make sure you're passing the `endpoints` array
2. Verify the form field name matches
3. Check that react-hook-form is properly initialized

### Validation errors

1. Ensure the field is included in your Zod schema
2. Check that the field type is `string` (not object)
3. Verify required/optional settings match your schema

## Related Documentation

- [Swagger GitHub Integration](./swagger-github-integration.md)
- [SwaggerEndpointSelector Component](../components/swagger-endpoint-selector.md)
- [Form Patterns](../patterns/forms.md)
- [React Hook Form](https://react-hook-form.com/)
