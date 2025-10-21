'use client';

/**
 * Type-safe routing hooks for Client Components
 *
 * This file contains hooks that require client-side functionality.
 * It must be marked with 'use client' since it uses Next.js useRouter hook.
 */

import { useRouter } from 'next/navigation';
import { type Route, type QueryParams, type RouteParams } from './builder';

/**
 * Type-safe router hook - drop-in replacement for Next.js useRouter
 *
 * Provides type-safe navigation methods that validate route parameters at compile time.
 *
 * @example
 * function MyComponent() {
 *   const router = useTypedRouter();
 *
 *   const handleClick = () => {
 *     // Type-safe navigation
 *     router.push(routes.projects.detail, { projectId: '123' });
 *   };
 *
 *   return <button onClick={handleClick}>View Project</button>;
 * }
 */
export function useTypedRouter() {
  const router = useRouter();

  return {
    /**
     * Navigate to a route (replaces current entry in history stack)
     */
    push: <TPath extends string>(
      route: Route<TPath>,
      params?: RouteParams<Route<TPath>>,
      query?: QueryParams
    ) => {
      const href = params
        ? (route.path as any)(params, query)
        : (route.path as any)(query);
      router.push(href);
    },

    /**
     * Replace current route in history stack
     */
    replace: <TPath extends string>(
      route: Route<TPath>,
      params?: RouteParams<Route<TPath>>,
      query?: QueryParams
    ) => {
      const href = params
        ? (route.path as any)(params, query)
        : (route.path as any)(query);
      router.replace(href);
    },

    /**
     * Navigate back in history
     */
    back: () => router.back(),

    /**
     * Navigate forward in history
     */
    forward: () => router.forward(),

    /**
     * Refresh the current route
     */
    refresh: () => router.refresh(),

    /**
     * Prefetch a route for faster navigation
     */
    prefetch: <TPath extends string>(
      route: Route<TPath>,
      params?: RouteParams<Route<TPath>>
    ) => {
      const href = params
        ? (route.path as any)(params)
        : (route.path as any)();
      router.prefetch(href);
    },
  };
}
