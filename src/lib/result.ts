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
 *   return toResult(() => db.project.create({ data }));
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

/**
 * Wrap an async operation in a Result type
 *
 * This helper eliminates try-catch boilerplate in service methods.
 * It catches any errors thrown by the operation and converts them to failure results.
 *
 * @param operation - An async function that performs the database operation
 * @returns A Promise that resolves to a Result containing either the operation's data or an error message
 *
 * @example
 * // Simple operation
 * return toResult(() => db.project.create({ data }));
 *
 * @example
 * // Complex operation with multiple steps
 * return toResult(async () => {
 *   const maxOrder = await db.task.findFirst({ orderBy: { order: "desc" } });
 *   const order = maxOrder ? maxOrder.order + 1 : 0;
 *   return db.task.create({ data: { ...data, order } });
 * });
 */
export async function toResult<T>(
  operation: () => Promise<T>,
): Promise<Result<T>> {
  try {
    const data = await operation();
    return success(data);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}
