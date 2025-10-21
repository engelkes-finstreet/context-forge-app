import { NextRequest, NextResponse } from "next/server";
import { fetchProjectSwaggerEndpoints } from "@/lib/actions/swagger-actions";

export const dynamic = "force-dynamic";

/**
 * API route to fetch swagger endpoints for a specific project
 *
 * Usage:
 * GET /api/swagger/{projectId}
 * GET /api/swagger/{projectId}?search=users
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get("search");

    console.log(`\n🔄 Fetching swagger for project: ${projectId}\n`);

    const result = await fetchProjectSwaggerEndpoints(projectId);

    if (result?.error) {
      return NextResponse.json(
        {
          error: result.error,
        },
        { status: 400 }
      );
    }

    let endpoints = result?.endpoints || [];

    // Apply search filter if provided
    if (searchQuery && endpoints.length > 0) {
      const { SwaggerService } = await import("@/lib/services/swagger-service");
      endpoints = SwaggerService.searchEndpoints(endpoints, searchQuery);
      console.log(`🔍 Search results for "${searchQuery}": ${endpoints.length} endpoints\n`);
    }

    return NextResponse.json({
      success: true,
      data: {
        projectId,
        totalEndpoints: endpoints.length,
        endpoints,
        searchQuery: searchQuery || null,
      },
    });
  } catch (error) {
    console.error("Error fetching project swagger:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch swagger endpoints",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
