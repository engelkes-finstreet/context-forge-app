'use client';

import { useRouter } from 'next/navigation';
import { TypeCard } from './type-card';
import { getEnabledTypes } from '@/features/subtasks/config/type-config';
import { Button } from '@/components/ui/button';

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

  const handleTypeSelect = (route: string) => {
    router.push(`/projects/${projectId}/tasks/${taskId}/subtasks/new/${route}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Create New Subtask</h2>
        <p className="text-muted-foreground">
          Select the type of subtask you want to create
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {enabledTypes.map((config) => (
          <TypeCard
            key={config.type}
            config={config}
            onClick={() => handleTypeSelect(config.route)}
          />
        ))}
      </div>

      {enabledTypes.length === 0 && (
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
