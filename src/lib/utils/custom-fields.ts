import { db } from "@/lib/db";
import {
  CustomFieldDefinition,
  ProjectCustomFieldsConfig,
} from "@/lib/types/custom-fields";

/**
 * Fetches custom field definitions for a project
 *
 * @param projectId - The project ID
 * @returns Array of custom field definitions
 */
export async function getProjectCustomFields(
  projectId: string
): Promise<CustomFieldDefinition[]> {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { customFieldDefinitions: true },
  });

  if (!project?.customFieldDefinitions) {
    return [];
  }

  try {
    const config = project.customFieldDefinitions as ProjectCustomFieldsConfig;
    return config.fields || [];
  } catch (error) {
    console.error("Error parsing custom field definitions:", error);
    return [];
  }
}

/**
 * Gets custom field values from subtask metadata
 *
 * @param metadata - The subtask metadata object
 * @returns Custom field values or empty object
 */
export function getCustomFieldValues(
  metadata: any
): Record<string, string | null> {
  if (!metadata || typeof metadata !== "object") {
    return {};
  }

  return metadata.customFields || {};
}
