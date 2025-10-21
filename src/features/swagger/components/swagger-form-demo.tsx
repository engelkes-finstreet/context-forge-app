"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormSwaggerEndpointSelector } from "@/components/forms/fields/form-swagger-endpoint-selector";
import { FormInput } from "@/components/forms/fields/form-input";
import { FormTextarea } from "@/components/forms/fields/form-textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { SwaggerEndpoint } from "@/lib/services/swagger-service";
import { fetchProjectSwaggerEndpoints } from "@/lib/actions/swagger-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Project {
  id: string;
  name: string;
  description: string | null;
  githubRepo: string | null;
  swaggerPath: string | null;
}

// Demo form schema
const demoFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  endpoint: z.string().min(1, "Please select an endpoint"),
});

type DemoFormValues = z.infer<typeof demoFormSchema>;

export function SwaggerFormDemo() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>("");
  const [endpoints, setEndpoints] = React.useState<SwaggerEndpoint[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingProjects, setLoadingProjects] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [submittedData, setSubmittedData] = React.useState<DemoFormValues | null>(null);

  const form = useForm<DemoFormValues>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      name: "",
      description: "",
      endpoint: "",
    },
  });

  // Fetch projects on mount
  React.useEffect(() => {
    async function loadProjects() {
      try {
        setLoadingProjects(true);
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (err) {
        console.error("Error loading projects:", err);
        setError(err instanceof Error ? err.message : "Failed to load projects");
      } finally {
        setLoadingProjects(false);
      }
    }

    loadProjects();
  }, []);

  // Fetch endpoints when project changes
  React.useEffect(() => {
    async function loadEndpoints() {
      if (!selectedProjectId) {
        setEndpoints([]);
        form.setValue("endpoint", "");
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setEndpoints([]);
        form.setValue("endpoint", "");

        const result = await fetchProjectSwaggerEndpoints(selectedProjectId);

        if (result?.error) {
          setError(result.error);
          setEndpoints([]);
        } else if (result?.endpoints) {
          setEndpoints(result.endpoints);
        }
      } catch (err) {
        console.error("Error loading endpoints:", err);
        setError(err instanceof Error ? err.message : "Failed to load endpoints");
        setEndpoints([]);
      } finally {
        setLoading(false);
      }
    }

    loadEndpoints();
  }, [selectedProjectId, form]);

  const onSubmit = (data: DemoFormValues) => {
    setSubmittedData(data);
    console.log("Form submitted:", data);
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>React Hook Form Integration Demo</CardTitle>
        <CardDescription>
          This demonstrates how to use the FormSwaggerEndpointSelector component with react-hook-form.
          Select a project, then fill out the form to see how the endpoint value is stored.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Selector */}
        <div className="space-y-2">
          <Label htmlFor="project-select">Project</Label>
          <Select
            value={selectedProjectId}
            onValueChange={(value) => {
              setSelectedProjectId(value);
              setSubmittedData(null);
            }}
            disabled={loadingProjects}
          >
            <SelectTrigger id="project-select">
              <SelectValue placeholder={loadingProjects ? "Loading projects..." : "Select a project"} />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex flex-col">
                    <span>{project.name}</span>
                    {project.githubRepo && (
                      <span className="text-xs text-muted-foreground">
                        {project.githubRepo}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Project Info */}
        {selectedProject && (
          <div className="rounded-lg border p-4 space-y-2">
            <h3 className="font-semibold text-sm">Project Details</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">GitHub Repo:</span>{" "}
                <span className="font-mono">
                  {selectedProject.githubRepo || "Not configured"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Swagger Path:</span>{" "}
                <span className="font-mono">
                  {selectedProject.swaggerPath || "Not configured"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {!loading && !error && endpoints.length > 0 && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Loaded {endpoints.length} endpoint{endpoints.length !== 1 ? "s" : ""}.
              Now fill out the form below.
            </AlertDescription>
          </Alert>
        )}

        {/* React Hook Form */}
        {selectedProjectId && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                name="name"
                fieldConfig={{
                  type: "input",
                  label: "Request Name",
                  placeholder: "e.g., Get User Profile",
                  description: "A descriptive name for this API request",
                }}
              />

              <FormTextarea
                name="description"
                fieldConfig={{
                  type: "textarea",
                  label: "Description (optional)",
                  placeholder: "Additional details about this request...",
                }}
              />

              <FormSwaggerEndpointSelector
                name="endpoint"
                fieldConfig={{
                  label: "API Endpoint",
                  description: "Select the API endpoint for this request",
                  placeholder: loading ? "Loading endpoints..." : "Select an endpoint...",
                  emptyText: error ? "Failed to load endpoints" : "No endpoints found.",
                }}
                endpoints={endpoints}
                loading={loading}
                disabled={!endpoints.length && !loading}
              />

              <Button type="submit" disabled={loading}>
                Submit Form
              </Button>
            </form>
          </Form>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Submitted Data Display */}
        {submittedData && (
          <div className="rounded-lg border p-4 space-y-3 bg-muted/50">
            <h3 className="font-semibold">Form Values (Submitted)</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>{" "}
                <span className="font-medium">{submittedData.name}</span>
              </div>
              {submittedData.description && (
                <div>
                  <span className="text-muted-foreground">Description:</span>{" "}
                  <span>{submittedData.description}</span>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Endpoint (stored value):</span>{" "}
                <code className="bg-background px-2 py-1 rounded text-xs">
                  {submittedData.endpoint}
                </code>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-3">
              💡 The endpoint is stored as "METHOD:PATH" (e.g., "GET:/api/users") for easy serialization.
              Check the browser console for the full form data.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
