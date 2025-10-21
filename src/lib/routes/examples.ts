/**
 * Type-Safe Routing Examples
 *
 * This file demonstrates the type safety and usage patterns of the routing system.
 * It serves as both documentation and a compile-time verification of type correctness.
 *
 * ⚠️ NOTE: This file is meant for demonstration only. Uncomment the error examples
 * to see TypeScript catch invalid usage at compile time.
 */

import { routes } from './index';
import type { RouteParams } from './builder';

// ============================================================================
// BASIC USAGE EXAMPLES
// ============================================================================

/**
 * Example 1: Static Routes
 * Routes without parameters can be called without arguments
 */
export function exampleStaticRoutes() {
  // ✅ Valid: Static routes don't need parameters
  const homePath = routes.home.path();
  // Result: '/'

  const signInPath = routes.auth.signIn.path();
  // Result: '/sign-in'

  const projectsListPath = routes.projects.list.path();
  // Result: '/projects'

  return { homePath, signInPath, projectsListPath };
}

/**
 * Example 2: Routes with Single Parameter
 * TypeScript enforces that required parameters must be provided
 */
export function exampleSingleParamRoutes() {
  // ✅ Valid: Parameter provided
  const projectDetailPath = routes.projects.detail.path({
    projectId: '550e8400-e29b-41d4-a716-446655440000',
  });
  // Result: '/projects/550e8400-e29b-41d4-a716-446655440000'

  // ❌ TypeScript Error: Missing required parameter
  // Uncomment to see the error:
  // const invalidPath = routes.projects.detail.path();
  // Error: An argument for 'params' was not provided.

  // ❌ TypeScript Error: Wrong parameter name
  // Uncomment to see the error:
  // const invalidPath2 = routes.projects.detail.path({ id: '123' });
  // Error: Object literal may only specify known properties,
  //        and 'id' does not exist in type '{ projectId: string }'

  return { projectDetailPath };
}

/**
 * Example 3: Routes with Multiple Parameters
 * All required parameters must be provided
 */
export function exampleMultiParamRoutes() {
  // ✅ Valid: All parameters provided
  const taskDetailPath = routes.projects.tasks.detail.path({
    projectId: '550e8400-e29b-41d4-a716-446655440000',
    taskId: '660e8400-e29b-41d4-a716-446655440001',
  });
  // Result: '/projects/550e8400-e29b-41d4-a716-446655440000/tasks/660e8400-e29b-41d4-a716-446655440001'

  // ✅ Valid: Deeply nested route with all params
  const subtaskEditPath = routes.projects.tasks.subtasks.edit.path({
    projectId: '550e8400-e29b-41d4-a716-446655440000',
    taskId: '660e8400-e29b-41d4-a716-446655440001',
    subtaskId: '770e8400-e29b-41d4-a716-446655440002',
  });
  // Result: '/projects/550e8400-e29b-41d4-a716-446655440000/tasks/660e8400-e29b-41d4-a716-446655440001/subtasks/770e8400-e29b-41d4-a716-446655440002/edit'

  // ❌ TypeScript Error: Missing required parameter
  // Uncomment to see the error:
  // const invalidPath = routes.projects.tasks.detail.path({
  //   projectId: '123',
  //   // taskId is missing!
  // });
  // Error: Property 'taskId' is missing in type '{ projectId: string; }'

  return { taskDetailPath, subtaskEditPath };
}

/**
 * Example 4: Query Parameters
 * Query parameters are always optional and type-safe
 */
export function exampleQueryParameters() {
  // ✅ Valid: Query params on static route
  const projectsWithQuery = routes.projects.list.path({
    view: 'grid',
    sort: 'name',
    archived: false,
  });
  // Result: '/projects?view=grid&sort=name&archived=false'

  // ✅ Valid: Query params on dynamic route
  const projectDetailWithQuery = routes.projects.detail.path(
    { projectId: '550e8400-e29b-41d4-a716-446655440000' },
    { tab: 'tasks', view: 'details' }
  );
  // Result: '/projects/550e8400-e29b-41d4-a716-446655440000?tab=tasks&view=details'

  // ✅ Valid: Array query values
  const projectsWithTags = routes.projects.list.path({
    tags: ['important', 'urgent', 'in-progress'],
  });
  // Result: '/projects?tags=important&tags=urgent&tags=in-progress'

  // ✅ Valid: Mixed query types
  const projectsWithMixed = routes.projects.list.path({
    search: 'example',
    page: 2,
    limit: 20,
    archived: true,
    tags: ['a', 'b'],
  });
  // Result: '/projects?search=example&page=2&limit=20&archived=true&tags=a&tags=b'

  // ✅ Valid: Undefined values are ignored
  const projectsWithUndefined = routes.projects.list.path({
    search: 'example',
    archived: undefined, // This will be omitted from the query string
  });
  // Result: '/projects?search=example'

  return {
    projectsWithQuery,
    projectDetailWithQuery,
    projectsWithTags,
    projectsWithMixed,
    projectsWithUndefined,
  };
}

// ============================================================================
// ADVANCED USAGE EXAMPLES
// ============================================================================

/**
 * Example 5: URL Encoding
 * Parameters are automatically URL-encoded
 */
export function exampleUrlEncoding() {
  // ✅ Special characters are encoded
  const encodedPath = routes.projects.detail.path({
    projectId: 'project with spaces',
  });
  // Result: '/projects/project%20with%20spaces'

  const encodedPath2 = routes.projects.detail.path({
    projectId: 'project/with/slashes',
  });
  // Result: '/projects/project%2Fwith%2Fslashes'

  return { encodedPath, encodedPath2 };
}

/**
 * Example 6: Accessing Route Patterns
 * You can access the original route pattern
 */
export function exampleRoutePatterns() {
  // ✅ Access the pattern for debugging or validation
  const homePattern = routes.home.pattern;
  // Result: '/'

  const projectPattern = routes.projects.detail.pattern;
  // Result: '/projects/[projectId]'

  const taskPattern = routes.projects.tasks.detail.pattern;
  // Result: '/projects/[projectId]/tasks/[taskId]'

  const subtaskPattern = routes.projects.tasks.subtasks.edit.pattern;
  // Result: '/projects/[projectId]/tasks/[taskId]/subtasks/[subtaskId]/edit'

  return { homePattern, projectPattern, taskPattern, subtaskPattern };
}

/**
 * Example 7: Type Extraction
 * Extract parameter types from routes for reuse
 */
export function exampleTypeExtraction() {
  // Extract params type from a route
  type ProjectDetailParams = RouteParams<typeof routes.projects.detail>;
  // Result: { projectId: string }

  type TaskDetailParams = RouteParams<typeof routes.projects.tasks.detail>;
  // Result: { projectId: string; taskId: string }

  // Use extracted type in function signature
  function navigateToProject(params: ProjectDetailParams) {
    return routes.projects.detail.path(params);
  }

  function navigateToTask(params: TaskDetailParams) {
    return routes.projects.tasks.detail.path(params);
  }

  // ✅ Valid usage
  const path1 = navigateToProject({ projectId: '123' });
  const path2 = navigateToTask({ projectId: '123', taskId: '456' });

  return { path1, path2 };
}

/**
 * Example 8: Dynamic Route Selection
 * Select routes dynamically based on conditions
 */
export function exampleDynamicRouteSelection() {
  const subtaskTypeRoutes = {
    generic: routes.projects.tasks.subtasks.newGeneric,
    'inquiry-process': routes.projects.tasks.subtasks.newInquiryProcess,
    form: routes.projects.tasks.subtasks.newForm,
    modal: routes.projects.tasks.subtasks.newModal,
  } as const;

  // ✅ Type-safe dynamic route selection
  type SubtaskType = keyof typeof subtaskTypeRoutes;

  function getSubtaskCreatePath(
    type: SubtaskType,
    projectId: string,
    taskId: string
  ) {
    const route = subtaskTypeRoutes[type];
    return route.path({ projectId, taskId });
  }

  const genericPath = getSubtaskCreatePath('generic', '123', '456');
  // Result: '/projects/123/tasks/456/subtasks/new/generic'

  const formPath = getSubtaskCreatePath('form', '123', '456');
  // Result: '/projects/123/tasks/456/subtasks/new/form'

  return { genericPath, formPath };
}

/**
 * Example 9: API Routes
 * API routes work the same way as page routes
 */
export function exampleApiRoutes() {
  // ✅ Static API routes
  const listResourcesPath = routes.api.mcp.listResources.path();
  // Result: '/api/mcp/list-resources'

  const readResourcePath = routes.api.mcp.readResource.path();
  // Result: '/api/mcp/read-resource'

  // ✅ With query params (for GET requests)
  const listResourcesWithQuery = routes.api.mcp.listResources.path({
    type: 'tasks',
    limit: '10',
  });
  // Result: '/api/mcp/list-resources?type=tasks&limit=10'

  return { listResourcesPath, readResourcePath, listResourcesWithQuery };
}

// ============================================================================
// REAL-WORLD USAGE PATTERNS
// ============================================================================

/**
 * Example 10: Navigation Helper Function
 * Create reusable navigation helpers with type safety
 */
export function createNavigationHelpers() {
  return {
    /**
     * Navigate to project detail page
     */
    toProjectDetail: (projectId: string) =>
      routes.projects.detail.path({ projectId }),

    /**
     * Navigate to task detail page
     */
    toTaskDetail: (projectId: string, taskId: string) =>
      routes.projects.tasks.detail.path({ projectId, taskId }),

    /**
     * Navigate to task edit page
     */
    toTaskEdit: (projectId: string, taskId: string) =>
      routes.projects.tasks.edit.path({ projectId, taskId }),

    /**
     * Navigate to subtask edit page
     */
    toSubtaskEdit: (projectId: string, taskId: string, subtaskId: string) =>
      routes.projects.tasks.subtasks.edit.path({
        projectId,
        taskId,
        subtaskId,
      }),

    /**
     * Navigate to projects list with optional filters
     */
    toProjectsList: (filters?: {
      view?: string;
      sort?: string;
      search?: string;
    }) => routes.projects.list.path(filters),
  };
}

/**
 * Example 11: Breadcrumb Generation
 * Generate breadcrumbs with type-safe routes
 */
export function generateBreadcrumbs(params: {
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskTitle?: string;
}) {
  const breadcrumbs: Array<{ label: string; href: string }> = [];

  // Always include home
  breadcrumbs.push({
    label: 'Home',
    href: routes.home.path(),
  });

  // Add projects
  breadcrumbs.push({
    label: 'Projects',
    href: routes.projects.list.path(),
  });

  // Add project if present
  if (params.projectId && params.projectName) {
    breadcrumbs.push({
      label: params.projectName,
      href: routes.projects.detail.path({ projectId: params.projectId }),
    });
  }

  // Add task if present
  if (params.projectId && params.taskId && params.taskTitle) {
    breadcrumbs.push({
      label: params.taskTitle,
      href: routes.projects.tasks.detail.path({
        projectId: params.projectId,
        taskId: params.taskId,
      }),
    });
  }

  return breadcrumbs;
}

/**
 * Example 12: Form Success Redirects
 * Type-safe redirect paths for form submissions
 */
export function getFormRedirectPaths() {
  return {
    /**
     * After creating a project, redirect to its detail page
     */
    afterProjectCreate: (projectId: string) =>
      routes.projects.detail.path({ projectId }),

    /**
     * After deleting a project, redirect to projects list
     */
    afterProjectDelete: () => routes.projects.list.path(),

    /**
     * After creating a task, redirect to its detail page
     */
    afterTaskCreate: (projectId: string, taskId: string) =>
      routes.projects.tasks.detail.path({ projectId, taskId }),

    /**
     * After deleting a task, redirect to project detail
     */
    afterTaskDelete: (projectId: string) =>
      routes.projects.detail.path({ projectId }),

    /**
     * After creating/updating a subtask, redirect to task detail
     */
    afterSubtaskSave: (projectId: string, taskId: string) =>
      routes.projects.tasks.detail.path({ projectId, taskId }),

    /**
     * After successful sign in, redirect to home
     */
    afterSignIn: () => routes.home.path(),

    /**
     * After successful sign up, redirect to home
     */
    afterSignUp: () => routes.home.path(),
  };
}

// ============================================================================
// COMPILE-TIME TYPE SAFETY VERIFICATION
// ============================================================================

/**
 * This section contains commented-out code that would cause TypeScript errors.
 * Uncomment any of these to verify that TypeScript catches the errors at compile time.
 */

export function typeErrorExamples() {
  // ❌ Error: Missing required parameter
  // const error1 = routes.projects.detail.path();

  // ❌ Error: Wrong parameter name
  // const error2 = routes.projects.detail.path({ id: '123' });

  // ❌ Error: Wrong parameter type
  // const error3 = routes.projects.detail.path({ projectId: 123 });

  // ❌ Error: Missing one of multiple required parameters
  // const error4 = routes.projects.tasks.detail.path({ projectId: '123' });

  // ❌ Error: Extra unknown parameter
  // const error5 = routes.projects.detail.path({
  //   projectId: '123',
  //   extraParam: 'invalid',
  // });

  // ❌ Error: Wrong number of arguments
  // const error6 = routes.projects.detail.path(
  //   { projectId: '123' },
  //   { query: 'param' },
  //   'extra argument'
  // );
}
