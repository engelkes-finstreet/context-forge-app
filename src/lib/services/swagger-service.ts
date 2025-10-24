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
}
