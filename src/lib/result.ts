/**
 * Result Type - A type-safe pattern for handling success and error states
 *
 * This eliminates the need for try-catch blocks in server actions,
 * which is important because Next.js redirect() throws errors that
 * should not be caught.
 *
 * Usage in services:
 * ```typescript
 * static async createProject(data: CreateInput): Promise<Result<Project>> {
 *   try {
 *     const project = await db.project.create({ data });
 *     return success(project);
 *   } catch (error) {
 *     return failure(getErrorMessage(error));
 *   }
 * }
 * ```
 *
 * Usage in actions:
 * ```typescript
 * const result = await ProjectService.createProject(formData);
 * if (!result.success) {
 *   return { error: result.errorMessage, message: null };
 * }
 * // Use result.data here - TypeScript knows it's defined
 * revalidatePath("/projects");
 * typedRedirect(routes.projects.detail, { projectId: result.data.id });
 * ```
 */

export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errorMessage: string;
    };

/**
 * Create a success result
 */
export function success<T>(data: T): Result<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Create a failure result
 */
export function failure<T>(errorMessage: string): Result<T> {
  return {
    success: false,
    errorMessage,
  };
}

/**
 * Extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
}
