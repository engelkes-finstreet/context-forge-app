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

import { route } from './builder';

/**
 * All application routes organized by feature
 */
export const routes = {
  // ========================================================================
  // PUBLIC & AUTH ROUTES
  // ========================================================================

  /**
   * Authentication routes
   */
  auth: {
    /** Sign in page - /sign-in */
    signIn: route('/sign-in'),
    /** Sign up page - /sign-up */
    signUp: route('/sign-up'),
  },

  // ========================================================================
  // AUTHENTICATED ROUTES
  // ========================================================================

  /**
   * Home page - /
   * Requires authentication
   */
  home: route('/'),

  /**
   * Project-related routes
   */
  projects: {
    /** Projects list page - /projects */
    list: route('/projects'),

    /** Create new project page - /projects/new */
    new: route('/projects/new'),

    /**
     * Project detail page - /projects/[projectId]
     * @param projectId - UUID of the project
     */
    detail: route('/projects/[projectId]'),

    /**
     * Task-related routes (nested under projects)
     */
    tasks: {
      /**
       * Create new task page - /projects/[projectId]/tasks/new
       * @param projectId - UUID of the parent project
       */
      new: route('/projects/[projectId]/tasks/new'),

      /**
       * Task detail page - /projects/[projectId]/tasks/[taskId]
       * @param projectId - UUID of the parent project
       * @param taskId - UUID of the task
       */
      detail: route('/projects/[projectId]/tasks/[taskId]'),

      /**
       * Edit task page - /projects/[projectId]/tasks/[taskId]/edit
       * @param projectId - UUID of the parent project
       * @param taskId - UUID of the task
       */
      edit: route('/projects/[projectId]/tasks/[taskId]/edit'),

      /**
       * Subtask-related routes (nested under tasks)
       */
      subtasks: {
        /**
         * Subtask type selector page - /projects/[projectId]/tasks/[taskId]/subtasks/new
         * First step in creating a new subtask - user selects the type
         * @param projectId - UUID of the parent project
         * @param taskId - UUID of the parent task
         */
        typeSelector: route('/projects/[projectId]/tasks/[taskId]/subtasks/new'),

        /**
         * Create new generic subtask page
         * /projects/[projectId]/tasks/[taskId]/subtasks/new/generic
         * @param projectId - UUID of the parent project
         * @param taskId - UUID of the parent task
         */
        newGeneric: route(
          '/projects/[projectId]/tasks/[taskId]/subtasks/new/generic'
        ),

        /**
         * Create new inquiry process subtask page (future)
         * /projects/[projectId]/tasks/[taskId]/subtasks/new/inquiry-process
         * @param projectId - UUID of the parent project
         * @param taskId - UUID of the parent task
         */
        newInquiryProcess: route(
          '/projects/[projectId]/tasks/[taskId]/subtasks/new/inquiry-process'
        ),

        /**
         * Create new form subtask page (future)
         * /projects/[projectId]/tasks/[taskId]/subtasks/new/form
         * @param projectId - UUID of the parent project
         * @param taskId - UUID of the parent task
         */
        newForm: route(
          '/projects/[projectId]/tasks/[taskId]/subtasks/new/form'
        ),

        /**
         * Create new modal subtask page (future)
         * /projects/[projectId]/tasks/[taskId]/subtasks/new/modal
         * @param projectId - UUID of the parent project
         * @param taskId - UUID of the parent task
         */
        newModal: route(
          '/projects/[projectId]/tasks/[taskId]/subtasks/new/modal'
        ),

        /**
         * Edit subtask page
         * /projects/[projectId]/tasks/[taskId]/subtasks/[subtaskId]/edit
         * @param projectId - UUID of the parent project
         * @param taskId - UUID of the parent task
         * @param subtaskId - UUID of the subtask
         */
        edit: route(
          '/projects/[projectId]/tasks/[taskId]/subtasks/[subtaskId]/edit'
        ),
      },
    },
  },

  // ========================================================================
  // API ROUTES
  // ========================================================================

  /**
   * API routes
   */
  api: {
    /**
     * Better Auth API routes - handles authentication
     * Catch-all route: /api/auth/*
     */
    auth: route('/api/auth/[...all]'),

    /**
     * Model Context Protocol (MCP) API routes
     * Used by Claude Code to interact with the application
     */
    mcp: {
      /** List all tasks and subtasks - /api/mcp/list-resources */
      listResources: route('/api/mcp/list-resources'),

      /** Read task or subtask content - /api/mcp/read-resource */
      readResource: route('/api/mcp/read-resource'),

      /** Update task or subtask content - /api/mcp/update-resource */
      updateResource: route('/api/mcp/update-resource'),
    },
  },
} as const;

/**
 * Type representing all possible route paths in the application
 * Useful for type checking and validation
 */
export type AppRoute = typeof routes;

/**
 * Helper type to extract all route patterns as a union
 */
export type RoutePattern =
  | typeof routes.auth.signIn.pattern
  | typeof routes.auth.signUp.pattern
  | typeof routes.home.pattern
  | typeof routes.projects.list.pattern
  | typeof routes.projects.new.pattern
  | typeof routes.projects.detail.pattern
  | typeof routes.projects.tasks.new.pattern
  | typeof routes.projects.tasks.detail.pattern
  | typeof routes.projects.tasks.edit.pattern
  | typeof routes.projects.tasks.subtasks.typeSelector.pattern
  | typeof routes.projects.tasks.subtasks.newGeneric.pattern
  | typeof routes.projects.tasks.subtasks.newInquiryProcess.pattern
  | typeof routes.projects.tasks.subtasks.newForm.pattern
  | typeof routes.projects.tasks.subtasks.newModal.pattern
  | typeof routes.projects.tasks.subtasks.edit.pattern
  | typeof routes.api.auth.pattern
  | typeof routes.api.mcp.listResources.pattern
  | typeof routes.api.mcp.readResource.pattern
  | typeof routes.api.mcp.updateResource.pattern;
