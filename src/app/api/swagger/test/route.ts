import { NextRequest, NextResponse } from "next/server";
import { SwaggerService } from "@/lib/services/swagger-service";

export const dynamic = "force-dynamic";

/**
 * Test API route to fetch and display swagger endpoints
 *
 * Usage:
 * GET /api/swagger/test?repo=owner/repo&path=swagger.yaml
 * GET /api/swagger/test?repo=owner/repo&path=swagger.yaml&branch=develop
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const repo = searchParams.get("repo");
    const path = searchParams.get("path");
    const branch = searchParams.get("branch") || "main";

    if (!repo || !path) {
      return NextResponse.json(
        {
          error: "Missing required parameters",
          message: "Both 'repo' and 'path' query parameters are required",
          example: "/api/swagger/test?repo=owner/repo&path=swagger.yaml",
        },
        { status: 400 }
      );
    }

    console.log(`\n🔄 Fetching swagger from GitHub...`);
    console.log(`   Repository: ${repo}`);
    console.log(`   Path: ${path}`);
    console.log(`   Branch: ${branch}\n`);

    const endpoints = await SwaggerService.getEndpointsFromGitHub(
      repo,
      path,
      branch
    );

    // Log to console
    console.log("\n" + "=".repeat(80));
    console.log(`Swagger Endpoints Retrieved`);
    console.log(`GitHub Repo: ${repo}`);
    console.log(`Swagger Path: ${path}`);
    console.log(`Branch: ${branch}`);
    console.log(`Total Endpoints: ${endpoints.length}`);
    console.log("=".repeat(80));
    console.log("\n" + SwaggerService.formatEndpoints(endpoints));
    console.log("\n" + "=".repeat(80));

    // Group by tags
    const grouped = SwaggerService.groupEndpointsByTag(endpoints);
    console.log("\n📚 Endpoints grouped by tag:");
    for (const [tag, tagEndpoints] of Object.entries(grouped)) {
      console.log(`\n  ${tag} (${tagEndpoints.length} endpoints):`);
      tagEndpoints.forEach((endpoint) => {
        console.log(`    ${endpoint.method.padEnd(7)} ${endpoint.path}`);
      });
    }
    console.log("\n" + "=".repeat(80) + "\n");

    return NextResponse.json({
      success: true,
      data: {
        repository: repo,
        path,
        branch,
        totalEndpoints: endpoints.length,
        endpoints,
        groupedByTag: grouped,
      },
    });
  } catch (error) {
    console.error("Error fetching swagger:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch swagger endpoints",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
