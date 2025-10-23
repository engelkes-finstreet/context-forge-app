"use server";

import { SwaggerService } from "@/lib/services/swagger-service";
import { ProjectService } from "@/lib/services/project-service";
import type { SwaggerEndpoint } from "@/lib/services/swagger-service";

export type SwaggerActionState = {
  error: string | null;
  endpoints: SwaggerEndpoint[] | null;
} | null;

/**
 * Fetch and parse swagger endpoints from a project's GitHub repository
 * @param projectId - The ID of the project
 */
export async function fetchProjectSwaggerEndpoints(
  projectId: string
): Promise<SwaggerActionState> {
  try {
    // Get the project
    const project = await ProjectService.getProjectById(projectId);

    if (!project) {
      return {
        error: "Project not found",
        endpoints: null,
      };
    }

    if (!project.githubRepo) {
      return {
        error: "Project does not have a GitHub repository configured",
        endpoints: null,
      };
    }

    if (!project.swaggerPath) {
      return {
        error: "Project does not have a Swagger path configured",
        endpoints: null,
      };
    }

    // Fetch and parse endpoints
    const endpoints = await SwaggerService.getEndpointsFromGitHub(
      project.githubRepo,
      project.swaggerPath
    );

    // Log endpoints to console
    console.log("\n" + "=".repeat(80));
    console.log(`Swagger Endpoints for Project: ${project.name}`);
    console.log(`GitHub Repo: ${project.githubRepo}`);
    console.log(`Swagger Path: ${project.swaggerPath}`);
    console.log(`Total Endpoints: ${endpoints.length}`);
    console.log("=".repeat(80));
    console.log("\n" + SwaggerService.formatEndpoints(endpoints));
    console.log("\n" + "=".repeat(80));

    // Also log grouped by tags
    const grouped = SwaggerService.groupEndpointsByTag(endpoints);
    console.log("\n📚 Endpoints grouped by tag:");
    for (const [tag, tagEndpoints] of Object.entries(grouped)) {
      console.log(`\n  ${tag} (${tagEndpoints.length} endpoints):`);
      tagEndpoints.forEach((endpoint) => {
        console.log(`    ${endpoint.method.padEnd(7)} ${endpoint.path}`);
      });
    }
    console.log("\n" + "=".repeat(80) + "\n");

    return {
      error: null,
      endpoints,
    };
  } catch (error) {
    console.error("Failed to fetch swagger endpoints:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to fetch swagger endpoints",
      endpoints: null,
    };
  }
}

/**
 * Fetch swagger endpoints from any GitHub repository
 * @param githubRepo - Repository in format "owner/repo"
 * @param swaggerPath - Path to swagger file
 * @param branch - Optional branch name (default: main)
 */
export async function fetchSwaggerEndpoints(
  githubRepo: string,
  swaggerPath: string,
  branch?: string
): Promise<SwaggerActionState> {
  try {
    const endpoints = await SwaggerService.getEndpointsFromGitHub(
      githubRepo,
      swaggerPath,
      branch
    );

    // Log endpoints to console
    console.log("\n" + "=".repeat(80));
    console.log(`Swagger Endpoints`);
    console.log(`GitHub Repo: ${githubRepo}`);
    console.log(`Swagger Path: ${swaggerPath}`);
    console.log(`Total Endpoints: ${endpoints.length}`);
    console.log("=".repeat(80));
    console.log("\n" + SwaggerService.formatEndpoints(endpoints));
    console.log("\n" + "=".repeat(80) + "\n");

    return {
      error: null,
      endpoints,
    };
  } catch (error) {
    console.error("Failed to fetch swagger endpoints:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to fetch swagger endpoints",
      endpoints: null,
    };
  }
}

/**
 * Search endpoints from a project
 * @param projectId - The ID of the project
 * @param query - Search query
 */
export async function searchProjectEndpoints(
  projectId: string,
  query: string
): Promise<SwaggerActionState> {
  try {
    const result = await fetchProjectSwaggerEndpoints(projectId);

    if (result?.error || !result?.endpoints) {
      return result;
    }

    const filteredEndpoints = SwaggerService.searchEndpoints(
      result.endpoints,
      query
    );

    console.log(`\n🔍 Search results for "${query}": ${filteredEndpoints.length} endpoints found\n`);
    console.log(SwaggerService.formatEndpoints(filteredEndpoints));

    return {
      error: null,
      endpoints: filteredEndpoints,
    };
  } catch (error) {
    console.error("Failed to search endpoints:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to search endpoints",
      endpoints: null,
    };
  }
}
