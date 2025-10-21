'use client';

/**
 * Type-safe routing components for client-side navigation
 */

import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { type Route, type QueryParams, type RouteParams } from './builder';

/**
 * Props for TypedLink component when route has parameters
 */
interface TypedLinkPropsWithParams<TPath extends string>
  extends Omit<LinkProps, 'href'> {
  route: Route<TPath>;
  params: RouteParams<Route<TPath>>;
  query?: QueryParams;
  children: React.ReactNode;
  className?: string;
}

/**
 * Props for TypedLink component when route has no parameters
 */
interface TypedLinkPropsWithoutParams<TPath extends string>
  extends Omit<LinkProps, 'href'> {
  route: Route<TPath>;
  params?: never;
  query?: QueryParams;
  children: React.ReactNode;
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
 * Type-safe Link component - drop-in replacement for Next.js Link
 */
export function TypedLink<TPath extends string>({
  route,
  params,
  query,
  children,
  className,
  ...linkProps
}: TypedLinkProps<TPath>) {
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
 * Type-safe router hook - drop-in replacement for Next.js useRouter
 */
export function useTypedRouter() {
  const router = useRouter();

  return {
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

    back: () => router.back(),
    forward: () => router.forward(),
    refresh: () => router.refresh(),

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
