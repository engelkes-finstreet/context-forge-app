/**
 * Type-Safe Routing Tests
 *
 * These tests verify that the type-safe routing system works correctly
 * both at runtime and at compile time (via TypeScript).
 */

import { route } from '../builder';
import { routes } from '../index';

describe('Route Builder', () => {
  describe('Static Routes', () => {
    it('should generate correct path for static routes', () => {
      expect(routes.home.path()).toBe('/');
      expect(routes.auth.signIn.path()).toBe('/sign-in');
      expect(routes.auth.signUp.path()).toBe('/sign-up');
      expect(routes.projects.list.path()).toBe('/projects');
      expect(routes.projects.new.path()).toBe('/projects/new');
    });

    it('should generate path with query parameters', () => {
      expect(routes.projects.list.path({ view: 'grid' })).toBe(
        '/projects?view=grid'
      );
      expect(routes.projects.list.path({ view: 'grid', sort: 'name' })).toBe(
        '/projects?view=grid&sort=name'
      );
    });

    it('should handle undefined query parameters', () => {
      expect(routes.projects.list.path({ view: undefined })).toBe('/projects');
      expect(
        routes.projects.list.path({ view: 'grid', sort: undefined })
      ).toBe('/projects?view=grid');
    });
  });

  describe('Dynamic Routes', () => {
    it('should generate correct path for single parameter routes', () => {
      expect(routes.projects.detail.path({ projectId: '123' })).toBe(
        '/projects/123'
      );
    });

    it('should generate correct path for multi-parameter routes', () => {
      expect(
        routes.projects.tasks.detail.path({
          projectId: '123',
          taskId: '456',
        })
      ).toBe('/projects/123/tasks/456');

      expect(
        routes.projects.tasks.edit.path({
          projectId: '123',
          taskId: '456',
        })
      ).toBe('/projects/123/tasks/456/edit');
    });

    it('should generate correct path for deeply nested routes', () => {
      expect(
        routes.projects.tasks.subtasks.edit.path({
          projectId: '123',
          taskId: '456',
          subtaskId: '789',
        })
      ).toBe('/projects/123/tasks/456/subtasks/789/edit');
    });

    it('should URL encode parameter values', () => {
      expect(
        routes.projects.detail.path({
          projectId: 'project with spaces',
        })
      ).toBe('/projects/project%20with%20spaces');

      expect(
        routes.projects.detail.path({
          projectId: 'project/with/slashes',
        })
      ).toBe('/projects/project%2Fwith%2Fslashes');
    });

    it('should support query parameters with dynamic routes', () => {
      expect(
        routes.projects.detail.path({ projectId: '123' }, { tab: 'tasks' })
      ).toBe('/projects/123?tab=tasks');

      expect(
        routes.projects.tasks.detail.path(
          { projectId: '123', taskId: '456' },
          { view: 'details', edit: 'true' }
        )
      ).toBe('/projects/123/tasks/456?view=details&edit=true');
    });
  });

  describe('Query Parameters', () => {
    it('should handle string query values', () => {
      expect(routes.projects.list.path({ search: 'example' })).toBe(
        '/projects?search=example'
      );
    });

    it('should handle number query values', () => {
      expect(routes.projects.list.path({ page: 2 })).toBe('/projects?page=2');
      expect(routes.projects.list.path({ page: 2, limit: 10 })).toBe(
        '/projects?page=2&limit=10'
      );
    });

    it('should handle boolean query values', () => {
      expect(routes.projects.list.path({ archived: true })).toBe(
        '/projects?archived=true'
      );
      expect(routes.projects.list.path({ archived: false })).toBe(
        '/projects?archived=false'
      );
    });

    it('should handle array query values', () => {
      const path = routes.projects.list.path({
        tags: ['important', 'urgent'],
      });
      expect(path).toBe('/projects?tags=important&tags=urgent');
    });

    it('should ignore null and undefined values', () => {
      expect(routes.projects.list.path({ search: null as any })).toBe(
        '/projects'
      );
      expect(routes.projects.list.path({ search: undefined })).toBe(
        '/projects'
      );
    });

    it('should handle mixed query parameters', () => {
      const path = routes.projects.list.path({
        search: 'test',
        page: 2,
        archived: true,
        tags: ['a', 'b'],
        empty: undefined,
      });
      expect(path).toContain('search=test');
      expect(path).toContain('page=2');
      expect(path).toContain('archived=true');
      expect(path).toContain('tags=a&tags=b');
      expect(path).not.toContain('empty');
    });
  });

  describe('Route Patterns', () => {
    it('should expose the original pattern', () => {
      expect(routes.home.pattern).toBe('/');
      expect(routes.projects.detail.pattern).toBe('/projects/[projectId]');
      expect(routes.projects.tasks.detail.pattern).toBe(
        '/projects/[projectId]/tasks/[taskId]'
      );
      expect(routes.projects.tasks.subtasks.edit.pattern).toBe(
        '/projects/[projectId]/tasks/[taskId]/subtasks/[subtaskId]/edit'
      );
    });
  });

  describe('API Routes', () => {
    it('should generate correct API route paths', () => {
      expect(routes.api.mcp.listResources.path()).toBe(
        '/api/mcp/list-resources'
      );
      expect(routes.api.mcp.readResource.path()).toBe(
        '/api/mcp/read-resource'
      );
      expect(routes.api.mcp.updateResource.path()).toBe(
        '/api/mcp/update-resource'
      );
    });
  });

  describe('Subtask Type Routes', () => {
    it('should generate correct subtask type routes', () => {
      const params = { projectId: '123', taskId: '456' };

      expect(routes.projects.tasks.subtasks.typeSelector.path(params)).toBe(
        '/projects/123/tasks/456/subtasks/new'
      );
      expect(routes.projects.tasks.subtasks.newGeneric.path(params)).toBe(
        '/projects/123/tasks/456/subtasks/new/generic'
      );
      expect(
        routes.projects.tasks.subtasks.newInquiryProcess.path(params)
      ).toBe('/projects/123/tasks/456/subtasks/new/inquiry-process');
      expect(routes.projects.tasks.subtasks.newForm.path(params)).toBe(
        '/projects/123/tasks/456/subtasks/new/form'
      );
      expect(routes.projects.tasks.subtasks.newModal.path(params)).toBe(
        '/projects/123/tasks/456/subtasks/new/modal'
      );
    });
  });

  describe('Custom Route Builder', () => {
    it('should create custom routes', () => {
      const customRoute = route('/custom/[id]');
      expect(customRoute.path({ id: 'test' })).toBe('/custom/test');
    });

    it('should handle complex custom routes', () => {
      const customRoute = route('/api/v1/users/[userId]/posts/[postId]');
      expect(
        customRoute.path({
          userId: 'user123',
          postId: 'post456',
        })
      ).toBe('/api/v1/users/user123/posts/post456');
    });
  });
});

describe('Type Safety', () => {
  // These tests verify compile-time type safety
  // They will fail TypeScript compilation if types are incorrect

  it('should enforce required parameters at compile time', () => {
    // ✓ Valid: All params provided
    const validPath1 = routes.projects.detail.path({ projectId: '123' });

    // ✓ Valid: All params provided for multi-param route
    const validPath2 = routes.projects.tasks.detail.path({
      projectId: '123',
      taskId: '456',
    });

    // ✓ Valid: All params provided for deeply nested route
    const validPath3 = routes.projects.tasks.subtasks.edit.path({
      projectId: '123',
      taskId: '456',
      subtaskId: '789',
    });

    expect(validPath1).toBeDefined();
    expect(validPath2).toBeDefined();
    expect(validPath3).toBeDefined();

    // The following would cause TypeScript errors (uncomment to test):
    // routes.projects.detail.path(); // ❌ Error: params required
    // routes.projects.detail.path({ id: '123' }); // ❌ Error: wrong param name
    // routes.projects.tasks.detail.path({ projectId: '123' }); // ❌ Error: taskId missing
    // routes.projects.tasks.detail.path({ projectId: '123', id: '456' }); // ❌ Error: wrong param name
  });

  it('should allow static routes without parameters', () => {
    // ✓ Valid: Static routes don't require params
    expect(routes.home.path()).toBeDefined();
    expect(routes.projects.list.path()).toBeDefined();
    expect(routes.auth.signIn.path()).toBeDefined();
  });

  it('should accept query parameters on all routes', () => {
    // ✓ Valid: Query params are always optional
    expect(routes.home.path({ ref: 'email' })).toBeDefined();
    expect(routes.projects.list.path({ view: 'grid' })).toBeDefined();
    expect(
      routes.projects.detail.path({ projectId: '123' }, { tab: 'settings' })
    ).toBeDefined();
  });
});

describe('Edge Cases', () => {
  it('should handle empty strings in parameters', () => {
    expect(routes.projects.detail.path({ projectId: '' })).toBe('/projects/');
  });

  it('should handle special characters in parameters', () => {
    expect(
      routes.projects.detail.path({ projectId: 'test@#$%^&*()' })
    ).toContain('test');
  });

  it('should handle special characters in query values', () => {
    const path = routes.projects.list.path({ search: 'test & value' });
    expect(path).toContain('search=test');
  });

  it('should preserve pattern immutability', () => {
    const pattern1 = routes.projects.detail.pattern;
    routes.projects.detail.path({ projectId: '123' });
    const pattern2 = routes.projects.detail.pattern;
    expect(pattern1).toBe(pattern2);
    expect(pattern1).toBe('/projects/[projectId]');
  });
});
