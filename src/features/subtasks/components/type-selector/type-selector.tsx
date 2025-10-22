'use client';

import { useRouter } from 'next/navigation';
import { TypeCard } from './type-card';
import { getEnabledTypes } from '@/features/subtasks/config/type-config';
import { Button } from '@/components/ui/button';
import { StaggeredContainer, StaggeredItem } from '@/components/ui/staggered-container';
import { routes } from '@/lib/routes';

interface TypeSelectorProps {
  projectId: string;
  taskId: string;
}

/**
 * TypeSelector Component
 *
 * Displays a grid of type cards for selecting the subtask type to create.
 * This is Step 1 of the two-step subtask creation wizard.
 */
export function TypeSelector({ projectId, taskId }: TypeSelectorProps) {
  const router = useRouter();
  const enabledTypes = getEnabledTypes();

  // Map subtask type route strings to route objects
  const routeMap = {
    'generic': routes.projects.tasks.subtasks.newGeneric,
    'inquiry-process': routes.projects.tasks.subtasks.newInquiryProcess,
    'form': routes.projects.tasks.subtasks.newForm,
    'modal': routes.projects.tasks.subtasks.newModal,
  } as const;

  const handleTypeSelect = (route: string) => {
    const routeObj = routeMap[route];
    if (routeObj) {
      router.push(routeObj.path({ projectId, taskId }));
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-gradient">Create New Subtask</h2>
        <p className="text-muted-foreground">
          Select the type of subtask you want to create
        </p>
      </div>

      {enabledTypes.length > 0 ? (
        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enabledTypes.map((config) => (
            <StaggeredItem key={config.type}>
              <TypeCard
                config={config}
                onClick={() => handleTypeSelect(config.route)}
              />
            </StaggeredItem>
          ))}
        </StaggeredContainer>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No subtask types are currently available.</p>
          <p className="text-sm mt-2">
            Please contact your administrator to enable subtask types.
          </p>
        </div>
      )}

      <div className="flex justify-start">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
