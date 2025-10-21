"use client";

/**
 * DraggableSubtaskList Component
 *
 * User Flow:
 * 1. User drags a subtask to a new position
 * 2. UI updates immediately (optimistic update)
 * 3. Server action saves the new order in the database
 * 4. If successful, the optimistic state becomes the real state
 * 5. If failed, React automatically reverts to the previous state
 */

import { useOptimistic, useTransition, useState } from "react";

import {
  DndContext,          
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";
import { TypedLink } from "@/lib/routes";
import { routes } from "@/lib/routes";
import { getTypeConfig } from "@/features/subtasks/config/type-config";
import { reorderSubtasks } from "@/lib/actions/subtask-actions";
import { toast } from "sonner";
import type { Subtask } from "@/generated/prisma";

interface DraggableSubtaskListProps {
  subtasks: Subtask[];
  taskId: string;
  projectId: string;
}

interface SortableSubtaskItemProps {
  subtask: Subtask;
  index: number;
  projectId: string;
  taskId: string;
  isDragActive: boolean;  // Prevents clicks during/after drag operations
}

/**
 * Individual subtask item that can be dragged and reordered
 *
 * This component uses the useSortable hook from @dnd-kit/sortable to make
 * each subtask draggable. The hook provides everything needed to:
 * - Track drag state (is it being dragged?)
 * - Apply transform animations (smooth movement)
 * - Handle accessibility (keyboard navigation)
 */
function SortableSubtaskItem({ subtask, index, projectId, taskId, isDragActive }: SortableSubtaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subtask.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const typeConfig = getTypeConfig(subtask.type);

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <TypedLink
        route={routes.projects.tasks.subtasks.edit}
        params={{ projectId, taskId, subtaskId: subtask.id }}
        className="block"
        style={{
          // Disable all pointer events during drag to prevent navigation
          pointerEvents: isDragActive ? 'none' : 'auto'
        }}
      >
        <Card className="hover:border-primary transition-colors cursor-pointer">
          <CardHeader>
            <div className="flex items-start gap-3">
              <button
                {...attributes}
                {...listeners}
                className="mt-1 cursor-grab active:cursor-grabbing touch-none flex-shrink-0 p-1 hover:bg-accent rounded transition-colors"
                onClick={(e) => e.preventDefault()}  // Don't navigate when clicking drag handle
                aria-label="Drag to reorder"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </button>

              
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-sm font-semibold text-primary">
                  {index + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-lg flex-1">{subtask.name}</CardTitle>
                  <Badge variant={typeConfig.badgeVariant} className="shrink-0">
                    {typeConfig.icon} {typeConfig.label}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {subtask.content.substring(0, 200)}
                  {subtask.content.length > 200 && "..."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </TypedLink>
    </div>
  );
}

/**
 * Main component that renders a list of draggable subtasks
 *
 * Key Features:
 * 1. Uses useOptimistic for instant UI updates (optimistic updates)
 * 2. Uses useTransition to track pending state
 * 3. Configures sensors for drag interactions (mouse, touch, keyboard)
 * 4. Wraps items in DndContext and SortableContext providers
 */
export function DraggableSubtaskList({ subtasks, taskId, projectId }: DraggableSubtaskListProps) {
  const [optimisticItems, addOptimistic] = useOptimistic(
    subtasks,
    (_currentState, newItems: Subtask[]) => newItems
  );

  const [isPending, startTransition] = useTransition();

  /**
   * Track whether a drag operation is currently active or just completed.
   *
   * This prevents unwanted navigation when dragging items upward. Here's why:
   *
   * Problem: When dragging from bottom to top:
   * 1. User picks up card #10 (bottom)
   * 2. Drags it upward toward position #5
   * 3. As the dragged card moves UP, other cards (#6-#9) slide DOWN to fill the gap
   * 4. When user releases, their pointer is physically over card #9 (not the card they dragged!)
   * 5. Card #9's TypedLink receives the pointer-up event → triggers navigation ❌
   *
   * Solution:
   * - Set isDragActive = true when drag starts
   * - Keep it true for 100ms after drag ends (pointer-up happens during this window)
   * - Prevent all TypedLink clicks while isDragActive = true
   * - After 100ms delay, allow normal click behavior again
   */
  const [isDragActive, setIsDragActive] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Called when user starts dragging a subtask
   */
  function handleDragStart() {
    setIsDragActive(true);
  }

  /**
   * Called when user finishes dragging a subtask
   */
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // Keep isDragActive true for 100ms after drag ends to prevent clicks
    // This is necessary because the pointer-up event happens after onDragEnd
    setTimeout(() => setIsDragActive(false), 100);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = optimisticItems.findIndex((item) => item.id === active.id);
    const newIndex = optimisticItems.findIndex((item) => item.id === over.id);

    // Calculate the new order using arrayMove helper
    // arrayMove([A, B, C, D], 0, 2) => [B, C, A, D]
    const newItems = arrayMove(optimisticItems, oldIndex, newIndex);

    startTransition(async () => {
      addOptimistic(newItems);

      const result = await reorderSubtasks(
        taskId,
        newItems.map((item) => item.id)
      );

      if (result.error) {
        toast.error("Failed to reorder subtasks", {
          description: result.error,
        });
      } else {
        toast.success("Subtasks reordered successfully");
      }
    });
  }

  return (
    <>
      <DndContext
        sensors={sensors}                    // Mouse, touch, and keyboard sensors
        collisionDetection={closestCenter}   // Drop on the closest item
        onDragStart={handleDragStart}        // Track when drag starts
        onDragEnd={handleDragEnd}            // Handle reordering when drag ends
      >
        <SortableContext
          items={optimisticItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid gap-4">
            {optimisticItems.map((subtask, index) => (
              <SortableSubtaskItem
                key={subtask.id}
                subtask={subtask}
                index={index}
                projectId={projectId}
                taskId={taskId}
                isDragActive={isDragActive}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {isPending && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-lg px-4 py-2 shadow-lg">
          <p className="text-sm text-muted-foreground">Saving new order...</p>
        </div>
      )}
    </>
  );
}
