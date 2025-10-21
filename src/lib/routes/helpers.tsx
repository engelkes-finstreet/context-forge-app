'use client';

/**
 * Type-Safe Routing Helpers
 *
 * This module provides React components and hooks for type-safe routing.
 * - TypedLink: Drop-in replacement for Next.js Link with type safety
 * - useTypedRouter: Drop-in replacement for Next.js useRouter with type safety
 *
 * @example
 * import { TypedLink } from '@/lib/routes/helpers';
 * import { routes } from '@/lib/routes';
 *
 * <TypedLink route={routes.projects.detail} params={{ projectId: '123' }}>
 *   View Project
 * </TypedLink>
 */

import Link, { LinkProps } from 'next/link';
import { useRouter, redirect } from 'next/navigation';
import { type Route, type QueryParams, type RouteParams } from './builder';

/**
 * Props for TypedLink component when route has parameters
 */
interface TypedLinkPropsWithParams<TPath extends string>
  extends Omit<LinkProps, 'href'> {
  /** The route definition */
  route: Route<TPath>;
  /** Route parameters (required if route has params) */
  params: RouteParams<Route<TPath>>;
  /** Optional query parameters */
  query?: QueryParams;
  /** Link content */
  children: React.ReactNode;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Props for TypedLink component when route has no parameters
 */
interface TypedLinkPropsWithoutParams<TPath extends string>
  extends Omit<LinkProps, 'href'> {
  /** The route definition */
  route: Route<TPath>;
  /** Route parameters (not required if route has no params) */
  params?: never;
  /** Optional query parameters */
  query?: QueryParams;
  /** Link content */
  children: React.ReactNode;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Conditional props type based on whether route requires params
 */
type TypedLinkProps<TPath extends string> =
  keyof RouteParams<Route<TPath>> extends never
    ? TypedLinkPropsWithoutParams<TPath>
    : TypedLinkPropsWithParams<TPath>;

/**
 * Type-safe Link component that enforces correct route parameters.
 *
 * This is a drop-in replacement for Next.js Link that provides compile-time
 * type safety for route parameters.
 *
 * @example
 * // Static route (no params required)
 * <TypedLink route={routes.home}>
 *   Home
 * </TypedLink>
 *
 * @example
 * // Route with params (params are required and type-checked)
 * <TypedLink
 *   route={routes.projects.detail}
 *   params={{ projectId: '123' }}
 * >
 *   View Project
 * </TypedLink>
 *
 * @example
 * // Route with query params
 * <TypedLink
 *   route={routes.projects.list}
 *   query={{ view: 'grid', sort: 'name' }}
 * >
 *   Projects
 * </TypedLink>
 *
 * @example
 * // All Link props are supported
 * <TypedLink
 *   route={routes.projects.detail}
 *   params={{ projectId: '123' }}
 *   prefetch={false}
 *   className="text-blue-500"
 * >
 *   View Project
 * </TypedLink>
 */
export function TypedLink<TPath extends string>({
  route,
  params,
  query,
  children,
  className,
  ...linkProps
}: TypedLinkProps<TPath>) {
  // Build the href using the route's path function
  const href = params
    ? (route.path as any)(params, query)
    : (route.path as any)(query);

  return (
    <Link href={href} className={className} {...linkProps}>
      {children}
    </Link>
  );
}

/**
 * Type-safe router hook that provides type-checked navigation methods.
 *
 * This is an enhanced version of Next.js useRouter that provides type safety
 * for route navigation.
 *
 * @example
 * import { useTypedRouter } from '@/lib/routes/helpers';
 * import { routes } from '@/lib/routes';
 *
 * function MyComponent() {
 *   const router = useTypedRouter();
 *
 *   // Navigate to a static route
 *   router.push(routes.home);
 *
 *   // Navigate to a route with params
 *   router.push(routes.projects.detail, { projectId: '123' });
 *
 *   // Navigate with query params
 *   router.push(routes.projects.list, undefined, { view: 'grid' });
 * }
 */
export function useTypedRouter() {
  const router = useRouter();

  return {
    /**
     * Navigate to a route (type-safe)
     *
     * @param route - Route definition
     * @param params - Route parameters (required if route has params)
     * @param query - Optional query parameters
     *
     * @example
     * // Static route
     * router.push(routes.home);
     *
     * @example
     * // Route with params
     * router.push(routes.projects.detail, { projectId: '123' });
     *
     * @example
     * // Route with query
     * router.push(routes.projects.list, undefined, { view: 'grid' });
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
     * Replace current route (type-safe)
     *
     * @param route - Route definition
     * @param params - Route parameters (required if route has params)
     * @param query - Optional query parameters
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
     * Prefetch a route
     *
     * @param route - Route definition
     * @param params - Route parameters (required if route has params)
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

/**
 * Type-safe redirect for Server Actions and Server Components
 *
 * Drop-in replacement for next/navigation's redirect() with type safety.
 *
 * @example
 * import { typedRedirect } from '@/lib/routes/helpers';
 * import { routes } from '@/lib/routes';
 *
 * async function myAction() {
 *   'use server';
 *
 *   // Type-safe redirect (no need to wrap in redirect()!)
 *   typedRedirect(routes.projects.detail, { projectId: '123' });
 * }
 */
export function typedRedirect<TPath extends string>(
  route: Route<TPath>,
  params?: RouteParams<Route<TPath>>,
  query?: QueryParams
): never {
  const href = params
    ? (route.path as any)(params, query)
    : (route.path as any)(query);
  redirect(href);
}
