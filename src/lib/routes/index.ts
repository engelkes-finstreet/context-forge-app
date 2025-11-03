/**
 * Type-Safe Application Routes
 *
 * This file defines all routes in the application with full type safety.
 * Routes are organized to mirror the app directory structure.
 *
 * @example
 * import { routes } from '@/lib/routes';
 *
 * // Static route (no params)
 * routes.home.path() // '/'
 *
 * // Route with params
 * routes.projects.detail.path({ projectId: '123' }) // '/projects/123'
 *
 * // Route with query params
 * routes.projects.list.path({ view: 'grid' }) // '/projects?view=grid'
 *
 * // Nested route with multiple params
 * routes.projects.tasks.detail.path({
 *   projectId: '123',
 *   taskId: '456'
 * }) // '/projects/123/tasks/456'
 */

import { route } from "./builder";

/**
 * All application routes organized by feature
 */
export const routes = {
  // ========================================================================
  // PUBLIC & AUTH ROUTES
  // ========================================================================

  auth: {
    signIn: route("/sign-in"),
    signUp: route("/sign-up"),
  },

  // ========================================================================
  // AUTHENTICATED ROUTES
  // ========================================================================

  home: route("/"),

  projects: {
    list: route("/projects"),
    new: route("/projects/new"),
    detail: route("/projects/[projectId]"),
    edit: route("/projects/[projectId]/edit"),
    tasks: {
      new: route("/projects/[projectId]/tasks/new"),
      detail: route("/projects/[projectId]/tasks/[taskId]"),
      edit: route("/projects/[projectId]/tasks/[taskId]/edit"),
      subtasks: {
        typeSelector: route(
          "/projects/[projectId]/tasks/[taskId]/subtasks/new",
        ),
        newGeneric: route(
          "/projects/[projectId]/tasks/[taskId]/subtasks/new/generic",
        ),
        newInquiryProcess: route(
          "/projects/[projectId]/tasks/[taskId]/subtasks/inquiry-process",
        ),
        newForm: route("/projects/[projectId]/tasks/[taskId]/subtasks/form"),
        newModal: route("/projects/[projectId]/tasks/[taskId]/subtasks/modal"),
        newRequest: route(
          "/projects/[projectId]/tasks/[taskId]/subtasks/request",
        ),
        newPresentationList: route(
          "/projects/[projectId]/tasks/[taskId]/subtasks/presentation-list",
        ),
        detail: route(
          "/projects/[projectId]/tasks/[taskId]/subtasks/[subtaskId]",
        ),
        edit: route(
          "/projects/[projectId]/tasks/[taskId]/subtasks/[subtaskId]/edit",
        ),
        editRequest: route(
          "/projects/[projectId]/tasks/[taskId]/subtasks/[subtaskId]/request/edit",
        ),
      },
    },
  },

  // ========================================================================
  // API ROUTES
  // ========================================================================

  api: {
    auth: route("/api/auth/[...all]"),
    mcp: {
      listResources: route("/api/mcp/list-resources"),
      readResource: route("/api/mcp/read-resource"),
      updateResource: route("/api/mcp/update-resource"),
    },
  },
} as const;

export type AppRoute = typeof routes;

export type RoutePattern =
  | typeof routes.auth.signIn.pattern
  | typeof routes.auth.signUp.pattern
  | typeof routes.home.pattern
  | typeof routes.projects.list.pattern
  | typeof routes.projects.new.pattern
  | typeof routes.projects.detail.pattern
  | typeof routes.projects.edit.pattern
  | typeof routes.projects.tasks.new.pattern
  | typeof routes.projects.tasks.detail.pattern
  | typeof routes.projects.tasks.edit.pattern
  | typeof routes.projects.tasks.subtasks.typeSelector.pattern
  | typeof routes.projects.tasks.subtasks.newGeneric.pattern
  | typeof routes.projects.tasks.subtasks.newInquiryProcess.pattern
  | typeof routes.projects.tasks.subtasks.newForm.pattern
  | typeof routes.projects.tasks.subtasks.newModal.pattern
  | typeof routes.projects.tasks.subtasks.detail.pattern
  | typeof routes.projects.tasks.subtasks.edit.pattern
  | typeof routes.api.auth.pattern
  | typeof routes.api.mcp.listResources.pattern
  | typeof routes.api.mcp.readResource.pattern
  | typeof routes.api.mcp.updateResource.pattern;

// ========================================================================
// RE-EXPORTS - Import everything from '@/lib/routes'
// ========================================================================

// Type-safe Link component (works in Server and Client Components)
export { TypedLink } from "./link";

// Type-safe router hook (Client Components only)
export { useTypedRouter } from "./hooks";

// Server-side redirect
export { typedRedirect } from "./redirect";

// Type utilities (for advanced usage)
export type { Route, QueryParams, RouteParams } from "./builder";
