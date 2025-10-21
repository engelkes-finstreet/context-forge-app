"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SwaggerEndpointSelector } from "@/components/swagger/swagger-endpoint-selector";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import type { SwaggerEndpoint } from "@/lib/services/swagger-service";
import { fetchProjectSwaggerEndpoints } from "@/lib/actions/swagger-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Project {
  id: string;
  name: string;
  description: string | null;
  githubRepo: string | null;
  swaggerPath: string | null;
}

export function SwaggerEndpointTester() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>("");
  const [endpoints, setEndpoints] = React.useState<SwaggerEndpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = React.useState<SwaggerEndpoint | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [loadingProjects, setLoadingProjects] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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
        setSelectedEndpoint(null);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setEndpoints([]);
        setSelectedEndpoint(null);

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
  }, [selectedProjectId]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Swagger Endpoint Selector Demo</CardTitle>
        <CardDescription>
          Select a project to load its Swagger endpoints, then choose an endpoint to view details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Selector */}
        <div className="space-y-2">
          <Label htmlFor="project-select">Project</Label>
          <Select
            value={selectedProjectId}
            onValueChange={setSelectedProjectId}
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
            <h3 className="font-semibold">Project Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>{" "}
                <span className="font-medium">{selectedProject.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">GitHub Repo:</span>{" "}
                <span className="font-mono text-xs">
                  {selectedProject.githubRepo || "Not configured"}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Swagger Path:</span>{" "}
                <span className="font-mono text-xs">
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
              Successfully loaded {endpoints.length} endpoint{endpoints.length !== 1 ? "s" : ""}.
              Check the console for detailed output.
            </AlertDescription>
          </Alert>
        )}

        {/* Endpoint Selector */}
        {selectedProjectId && (
          <div className="space-y-2">
            <Label htmlFor="endpoint-select">API Endpoint</Label>
            <SwaggerEndpointSelector
              endpoints={endpoints}
              value={selectedEndpoint}
              onValueChange={setSelectedEndpoint}
              loading={loading}
              disabled={!endpoints.length && !loading}
              placeholder={
                loading
                  ? "Loading endpoints..."
                  : endpoints.length === 0
                  ? "No endpoints available"
                  : "Select an endpoint..."
              }
              emptyText={error ? "Failed to load endpoints" : "No endpoints found."}
            />
          </div>
        )}

        {/* Selected Endpoint Details */}
        {selectedEndpoint && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-semibold">Selected Endpoint Details</h3>
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge
                    className={`text-white ${
                      selectedEndpoint.method === "GET"
                        ? "bg-blue-500"
                        : selectedEndpoint.method === "POST"
                        ? "bg-green-500"
                        : selectedEndpoint.method === "PUT"
                        ? "bg-yellow-500"
                        : selectedEndpoint.method === "PATCH"
                        ? "bg-orange-500"
                        : selectedEndpoint.method === "DELETE"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {selectedEndpoint.method}
                  </Badge>
                  <code className="text-sm font-mono">{selectedEndpoint.path}</code>
                </div>

                {selectedEndpoint.summary && (
                  <div>
                    <span className="text-sm font-medium">Summary:</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedEndpoint.summary}
                    </p>
                  </div>
                )}

                {selectedEndpoint.description && (
                  <div>
                    <span className="text-sm font-medium">Description:</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedEndpoint.description}
                    </p>
                  </div>
                )}

                {selectedEndpoint.operationId && (
                  <div>
                    <span className="text-sm font-medium">Operation ID:</span>
                    <p className="text-sm text-muted-foreground font-mono mt-1">
                      {selectedEndpoint.operationId}
                    </p>
                  </div>
                )}

                {selectedEndpoint.tags && selectedEndpoint.tags.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Tags:</span>
                    <div className="flex gap-2 mt-2">
                      {selectedEndpoint.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
