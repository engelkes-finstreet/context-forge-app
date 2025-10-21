/**
 * Type-safe Link component for Server and Client Components
 *
 * This file contains the TypedLink component which can be used in both
 * Server and Client Components since it doesn't use any client-side hooks.
 */

import Link, { LinkProps } from 'next/link';
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
  style?: React.CSSProperties;
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
  style?: React.CSSProperties;
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
 *
 * Works in both Server and Client Components.
 *
 * @example
 * // Static route
 * <TypedLink route={routes.home}>Home</TypedLink>
 *
 * // With parameters
 * <TypedLink route={routes.projects.detail} params={{ projectId: '123' }}>
 *   View Project
 * </TypedLink>
 *
 * // With query params
 * <TypedLink route={routes.projects.list} query={{ view: 'grid' }}>
 *   Grid View
 * </TypedLink>
 */
export function TypedLink<TPath extends string>({
  route,
  params,
  query,
  children,
  className,
  style,
  ...linkProps
}: TypedLinkProps<TPath>) {
  const href = params
    ? (route.path as any)(params, query)
    : (route.path as any)(query);

  return (
    <Link href={href} className={className} style={style} {...linkProps}>
      {children}
    </Link>
  );
}
