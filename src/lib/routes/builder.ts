/**
 * Type-Safe Route Builder
 *
 * This module provides utilities for creating type-safe routes with automatic
 * parameter extraction from route patterns.
 *
 * @example
 * const myRoute = route('/projects/[projectId]/tasks/[taskId]');
 * myRoute.path({ projectId: '123', taskId: '456' }); // '/projects/123/tasks/456'
 * myRoute.path({ projectId: '123' }); // TypeScript Error: taskId is required
 */

/**
 * Extracts parameter names from a route pattern string.
 * Converts patterns like '/projects/[projectId]/tasks/[taskId]'
 * into { projectId: string; taskId: string }
 */
export type ExtractRouteParams<T extends string> =
  string extends T
    ? Record<string, string>
    : T extends `${infer _Start}[${infer Param}]${infer Rest}`
    ? { [K in Param | keyof ExtractRouteParams<Rest>]: string }
    : Record<string, never>;

/**
 * Checks if a route pattern has any dynamic parameters
 */
type HasParams<T extends string> = keyof ExtractRouteParams<T> extends never ? false : true;

/**
 * Query parameters type - allows string, number, boolean, or undefined values
 */
export type QueryParams = Record<string, string | number | boolean | string[] | undefined>;

/**
 * Route definition with pattern and type-safe path builder
 */
export interface Route<TPath extends string> {
  /** The original route pattern (e.g., '/projects/[projectId]') */
  readonly pattern: TPath;

  /**
   * Builds a path from the route pattern.
   * - If route has params, they are required as first argument
   * - If route has no params, params argument is optional (or omitted)
   * - Query params are always optional as second argument
   */
  path: HasParams<TPath> extends true
    ? (params: ExtractRouteParams<TPath>, query?: QueryParams) => string
    : (query?: QueryParams) => string;
}

/**
 * Creates a type-safe route definition.
 *
 * @param pattern - Route pattern with dynamic segments in [brackets]
 * @returns Route object with pattern and path builder function
 *
 * @example
 * // Static route
 * const home = route('/');
 * home.path(); // '/'
 *
 * @example
 * // Route with single parameter
 * const projectDetail = route('/projects/[projectId]');
 * projectDetail.path({ projectId: '123' }); // '/projects/123'
 *
 * @example
 * // Route with multiple parameters
 * const taskDetail = route('/projects/[projectId]/tasks/[taskId]');
 * taskDetail.path({ projectId: '123', taskId: '456' }); // '/projects/123/tasks/456'
 *
 * @example
 * // Route with query parameters
 * const projects = route('/projects');
 * projects.path({ view: 'grid', sort: 'name' }); // '/projects?view=grid&sort=name'
 */
export function route<TPath extends string>(pattern: TPath): Route<TPath> {
  return {
    pattern,
    path: ((paramsOrQuery?: any, query?: QueryParams) => {
      let path = pattern as string;

      // Determine if first argument is params or query
      // If route has params, first arg is params, second is query
      // If route has no params, first arg is query
      const hasParams = path.includes('[');
      const params = hasParams ? paramsOrQuery : undefined;
      const queryParams = hasParams ? query : paramsOrQuery;

      // Replace dynamic segments [param] with actual values
      if (params && typeof params === 'object') {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            path = path.replace(
              `[${key}]`,
              encodeURIComponent(String(value))
            );
          }
        });
      }

      // Add query parameters
      if (queryParams && typeof queryParams === 'object') {
        const searchParams = new URLSearchParams();

        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              // Handle array values by appending multiple times
              value.forEach((v) => {
                searchParams.append(key, String(v));
              });
            } else {
              searchParams.set(key, String(value));
            }
          }
        });

        const queryString = searchParams.toString();
        if (queryString) {
          path += `?${queryString}`;
        }
      }

      return path;
    }) as any, // Type assertion needed due to conditional typing
  };
}

/**
 * Type helper to extract the params type from a Route
 *
 * @example
 * const taskRoute = route('/projects/[projectId]/tasks/[taskId]');
 * type TaskParams = RouteParams<typeof taskRoute>; // { projectId: string; taskId: string }
 */
export type RouteParams<T> = T extends Route<infer TPath>
  ? ExtractRouteParams<TPath>
  : never;

/**
 * Type helper to check if a route requires parameters
 *
 * @example
 * const home = route('/');
 * const project = route('/projects/[projectId]');
 * type HomeNeedsParams = RouteRequiresParams<typeof home>; // false
 * type ProjectNeedsParams = RouteRequiresParams<typeof project>; // true
 */
export type RouteRequiresParams<T> = T extends Route<infer TPath>
  ? HasParams<TPath>
  : false;
