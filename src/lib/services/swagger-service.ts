import { Octokit } from "@octokit/rest";
import SwaggerParser from "@apidevtools/swagger-parser";
import type { OpenAPIV3, OpenAPIV2 } from "openapi-types";
import yaml from "js-yaml";

export interface SwaggerEndpoint {
  path: string;
  method: string;
  summary?: string;
  description?: string;
  operationId?: string;
  tags?: string[];
}

export interface DetailedSwaggerEndpoint extends SwaggerEndpoint {
  parameters?: Array<{
    name: string;
    in: string;
    required?: boolean;
    description?: string;
    schema?: any;
  }>;
  requestBody?: {
    description?: string;
    required?: boolean;
    content?: Record<string, any>;
  };
  responses?: Record<
    string,
    {
      description?: string;
      content?: Record<string, any>;
    }
  >;
}

export class SwaggerService {
  private static octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  /**
   * Fetch swagger file content from GitHub repository
   * @param githubRepo - Repository in format "owner/repo"
   * @param swaggerPath - Path to swagger file in the repository
   * @param branch - Branch name (default: main)
   */
  static async fetchSwaggerFromGitHub(
    githubRepo: string,
    swaggerPath: string,
    branch: string = "main",
  ): Promise<string> {
    const [owner, repo] = githubRepo.split("/");

    if (!owner || !repo) {
      throw new Error(
        "Invalid GitHub repository format. Expected 'owner/repo'",
      );
    }

    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: swaggerPath,
        ref: branch,
      });

      // GitHub API returns base64 encoded content
      if ("content" in data && data.content) {
        const content = Buffer.from(data.content, "base64").toString("utf-8");
        return content;
      }

      throw new Error("File content not found in GitHub response");
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to fetch swagger file from GitHub: ${error.message}`,
        );
      }
      throw error;
    }
  }

  /**
   * Parse swagger/OpenAPI file and extract all endpoints
   * @param swaggerContent - Raw swagger/OpenAPI content (YAML or JSON)
   */
  static async parseSwaggerEndpoints(
    swaggerContent: string,
  ): Promise<SwaggerEndpoint[]> {
    try {
      // First, parse the YAML/JSON string into an object
      let apiObject: any;
      try {
        // Try parsing as YAML (works for both YAML and JSON)
        apiObject = yaml.load(swaggerContent);
      } catch {
        // If YAML parsing fails, try JSON
        apiObject = JSON.parse(swaggerContent);
      }

      // Parse the document (more lenient than validate, won't fail on missing $refs)
      // This is sufficient for extracting endpoints
      const api = await SwaggerParser.parse(apiObject);

      const endpoints: SwaggerEndpoint[] = [];

      // Handle both OpenAPI 3.x and Swagger 2.x
      if (api.paths) {
        for (const [path, pathItem] of Object.entries(api.paths)) {
          if (!pathItem) continue;

          // Iterate through HTTP methods
          const methods = [
            "get",
            "post",
            "put",
            "patch",
            "delete",
            "options",
            "head",
          ] as const;

          for (const method of methods) {
            const operation = pathItem[method] as
              | OpenAPIV3.OperationObject
              | OpenAPIV2.OperationObject
              | undefined;

            if (operation) {
              endpoints.push({
                path,
                method: method.toUpperCase(),
                summary: operation.summary,
                description: operation.description,
                operationId: operation.operationId,
                tags: operation.tags,
              });
            }
          }
        }
      }

      return endpoints;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse swagger file: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Fetch and parse swagger file from GitHub in one step
   * @param githubRepo - Repository in format "owner/repo"
   * @param swaggerPath - Path to swagger file in the repository
   * @param branch - Branch name (default: main)
   */
  static async getEndpointsFromGitHub(
    githubRepo: string,
    swaggerPath: string,
    branch: string = "main",
  ): Promise<SwaggerEndpoint[]> {
    const swaggerContent = await this.fetchSwaggerFromGitHub(
      githubRepo,
      swaggerPath,
      branch,
    );

    return this.parseSwaggerEndpoints(swaggerContent);
  }

  /**
   * Format endpoints for display (useful for debugging/logging)
   */
  static formatEndpoints(endpoints: SwaggerEndpoint[]): string {
    return endpoints
      .map((endpoint) => {
        const parts = [`${endpoint.method.padEnd(7)} ${endpoint.path}`];

        if (endpoint.summary) {
          parts.push(`  Summary: ${endpoint.summary}`);
        }

        if (endpoint.tags && endpoint.tags.length > 0) {
          parts.push(`  Tags: ${endpoint.tags.join(", ")}`);
        }

        return parts.join("\n");
      })
      .join("\n\n");
  }

  /**
   * Group endpoints by tags for easier navigation
   */
  static groupEndpointsByTag(
    endpoints: SwaggerEndpoint[],
  ): Record<string, SwaggerEndpoint[]> {
    const grouped: Record<string, SwaggerEndpoint[]> = {
      untagged: [],
    };

    for (const endpoint of endpoints) {
      if (!endpoint.tags || endpoint.tags.length === 0) {
        grouped.untagged.push(endpoint);
      } else {
        for (const tag of endpoint.tags) {
          if (!grouped[tag]) {
            grouped[tag] = [];
          }
          grouped[tag].push(endpoint);
        }
      }
    }

    // Remove untagged if empty
    if (grouped.untagged.length === 0) {
      delete grouped.untagged;
    }

    return grouped;
  }

  /**
   * Search endpoints by path, method, or description
   */
  static searchEndpoints(
    endpoints: SwaggerEndpoint[],
    query: string,
  ): SwaggerEndpoint[] {
    const lowerQuery = query.toLowerCase();

    return endpoints.filter((endpoint) => {
      return (
        endpoint.path.toLowerCase().includes(lowerQuery) ||
        endpoint.method.toLowerCase().includes(lowerQuery) ||
        endpoint.summary?.toLowerCase().includes(lowerQuery) ||
        endpoint.description?.toLowerCase().includes(lowerQuery) ||
        endpoint.operationId?.toLowerCase().includes(lowerQuery) ||
        endpoint.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    });
  }

  /**
   * Get detailed endpoint information for specific paths from GitHub
   * @param githubRepo - Repository in format "owner/repo"
   * @param swaggerPath - Path to swagger file in the repository
   * @param endpointPaths - Array of API paths to get details for (e.g., ["/api/users", "/api/posts"])
   * @param branch - Branch name (default: main)
   */
  static async getDetailedEndpoints(
    githubRepo: string,
    swaggerPath: string,
    endpointPaths: string[],
    branch: string = "main",
  ): Promise<DetailedSwaggerEndpoint[]> {
    const swaggerContent = await this.fetchSwaggerFromGitHub(
      githubRepo,
      swaggerPath,
      branch,
    );

    return this.parseDetailedEndpoints(swaggerContent, endpointPaths);
  }

  /**
   * Parse swagger content and extract detailed information for specific paths
   */
  static async parseDetailedEndpoints(
    swaggerContent: string,
    endpointPaths: string[],
  ): Promise<DetailedSwaggerEndpoint[]> {
    try {
      // Parse YAML/JSON
      let apiObject: any;
      try {
        apiObject = yaml.load(swaggerContent);
      } catch {
        apiObject = JSON.parse(swaggerContent);
      }

      // Parse the document
      const api = await SwaggerParser.parse(apiObject);

      const detailedEndpoints: DetailedSwaggerEndpoint[] = [];

      // Iterate through requested paths
      for (const requestedPath of endpointPaths) {
        const pathItem = api.paths?.[requestedPath];
        if (!pathItem) continue;

        // Iterate through HTTP methods
        const methods = [
          "get",
          "post",
          "put",
          "patch",
          "delete",
          "options",
          "head",
        ] as const;

        for (const method of methods) {
          const operation = pathItem[method] as
            | OpenAPIV3.OperationObject
            | OpenAPIV2.OperationObject
            | undefined;

          if (operation) {
            const detailedEndpoint: DetailedSwaggerEndpoint = {
              path: requestedPath,
              method: method.toUpperCase(),
              summary: operation.summary,
              description: operation.description,
              operationId: operation.operationId,
              tags: operation.tags,
            };

            // Extract parameters
            if (operation.parameters) {
              detailedEndpoint.parameters = operation.parameters.map(
                (param: any) => ({
                  name: param.name,
                  in: param.in,
                  required: param.required,
                  description: param.description,
                  schema: param.schema,
                }),
              );
            }

            // Extract request body (OpenAPI 3.x)
            if ("requestBody" in operation && operation.requestBody) {
              const requestBody = operation.requestBody as any;
              detailedEndpoint.requestBody = {
                description: requestBody.description,
                required: requestBody.required,
                content: requestBody.content,
              };
            }

            // Extract responses
            if (operation.responses) {
              detailedEndpoint.responses = {};
              for (const [statusCode, response] of Object.entries(
                operation.responses,
              )) {
                const resp = response as any;
                detailedEndpoint.responses[statusCode] = {
                  description: resp.description,
                  content: resp.content,
                };
              }
            }

            detailedEndpoints.push(detailedEndpoint);
          }
        }
      }

      return detailedEndpoints;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to parse detailed endpoints: ${error.message}`,
        );
      }
      throw error;
    }
  }

  /**
   * Get raw swagger endpoint definitions for specific paths from GitHub
   * @param githubRepo - Repository in format "owner/repo"
   * @param swaggerPath - Path to swagger file in the repository
   * @param endpointPaths - Array of API paths to get definitions for
   * @param branch - Branch name (default: main)
   */
  static async getRawEndpointDefinitions(
    githubRepo: string,
    swaggerPath: string,
    endpointPaths: string[],
    branch: string = "main",
  ): Promise<Record<string, any>> {
    const swaggerContent = await this.fetchSwaggerFromGitHub(
      githubRepo,
      swaggerPath,
      branch,
    );

    return this.extractRawEndpointDefinitions(swaggerContent, endpointPaths);
  }

  /**
   * Extract raw endpoint definitions from swagger content
   */
  static async extractRawEndpointDefinitions(
    swaggerContent: string,
    endpointPaths: string[],
  ): Promise<Record<string, any>> {
    try {
      // Parse YAML/JSON
      let apiObject: any;
      try {
        apiObject = yaml.load(swaggerContent);
      } catch {
        apiObject = JSON.parse(swaggerContent);
      }

      // Parse the document
      const api = await SwaggerParser.parse(apiObject);

      const definitions: Record<string, any> = {};

      // Extract only the requested paths
      for (const path of endpointPaths) {
        if (api.paths?.[path]) {
          // Clone the path definition and remove responses from all methods
          const pathDefinition = JSON.parse(
            JSON.stringify(api.paths[path]),
          ) as any;

          // Remove responses from all HTTP methods
          const methods = [
            "get",
            "post",
            "put",
            "patch",
            "delete",
            "options",
            "head",
          ];
          for (const method of methods) {
            if (pathDefinition[method]) {
              delete pathDefinition[method].responses;
            }
          }

          definitions[path] = pathDefinition;
        }
      }

      return definitions;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to extract endpoint definitions: ${error.message}`,
        );
      }
      throw error;
    }
  }

  /**
   * Format raw endpoint definitions as YAML in markdown code blocks
   */
  static formatEndpointsAsYaml(
    definitions: Record<string, any>,
    listName?: string,
  ): string {
    if (Object.keys(definitions).length === 0) {
      return listName
        ? `## ${listName}\n\nNo endpoints found.`
        : "No endpoints found.";
    }

    const sections: string[] = [];

    if (listName) {
      sections.push(`## ${listName}\n`);
    }

    for (const [path, definition] of Object.entries(definitions)) {
      sections.push(`### ${path}\n`);
      sections.push("```yaml");
      sections.push(yaml.dump(definition, { indent: 2, lineWidth: -1 }));
      sections.push("```\n");
    }

    return sections.join("\n");
  }
}
