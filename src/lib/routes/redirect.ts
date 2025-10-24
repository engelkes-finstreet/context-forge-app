/**
 * Type-safe redirect for Server Actions and Server Components
 */

import { redirect } from "next/navigation";
import { type Route, type QueryParams, type RouteParams } from "./builder";

/**
 * Type-safe redirect - drop-in replacement for next/navigation's redirect()
 */
export function typedRedirect<TPath extends string>(
  route: Route<TPath>,
  params?: RouteParams<Route<TPath>>,
  query?: QueryParams,
): never {
  const href = params
    ? (route.path as any)(params, query)
    : (route.path as any)(query);
  redirect(href);
}
