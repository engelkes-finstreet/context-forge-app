import { NextResponse } from "next/server";
import { ProjectService } from "@/lib/services/project-service";

export const dynamic = "force-dynamic";

/**
 * Get all projects
 * GET /api/projects
 */
export async function GET() {
  try {
    const projects = await ProjectService.getAllProjects();

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch projects",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
