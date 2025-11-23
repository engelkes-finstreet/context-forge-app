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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GripVertical, CheckCircle2, Circle, Clock } from "lucide-react";
import { TypedLink } from "@/lib/routes";
import { routes } from "@/lib/routes";
import { getTypeConfig } from "@/features/subtasks/config/type-config";
import { toast } from "@/lib/toast";
import { Subtask, Status } from "@prisma/client";
import { reorderSubtasksAction } from "@/features/subtasks/actions/reorder-subtasks-action";

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
  isDragActive: boolean; // Prevents clicks during/after drag operations
}

/**
 * Get status configuration for badge display
 */
function getStatusConfig(status: Status) {
  switch (status) {
    case Status.OPEN:
      return {
        label: "Open",
        variant: "outline" as const,
        icon: <Circle className="h-3 w-3" />,
      };
    case Status.IN_PROGRESS:
      return {
        label: "In Progress",
        variant: "default" as const,
        icon: <Clock className="h-3 w-3" />,
      };
    case Status.DONE:
      return {
        label: "Done",
        variant: "secondary" as const,
        icon: <CheckCircle2 className="h-3 w-3" />,
      };
  }
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
function SortableSubtaskItem({
  subtask,
  index,
  projectId,
  taskId,
  isDragActive,
}: SortableSubtaskItemProps) {
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
    opacity: isDragging ? 0.5 : subtask.status === Status.DONE ? 0.6 : 1,
  };

  const typeConfig = getTypeConfig(subtask.type);
  const statusConfig = getStatusConfig(subtask.status);
  const isDone = subtask.status === Status.DONE;
  const isNotEditable = subtask.status === Status.DONE || subtask.status === Status.IN_PROGRESS;

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <TypedLink
        route={routes.projects.tasks.subtasks.detail}
        params={{ projectId, taskId, subtaskId: subtask.id }}
        className="block"
        style={{
          // Disable all pointer events during drag to prevent navigation
          pointerEvents: isDragActive ? "none" : "auto",
        }}
      >
        <Card interactive={true}>
          <CardHeader>
            <div className="flex items-start gap-3">
              <button
                {...(isNotEditable ? {} : attributes)}
                {...(isNotEditable ? {} : listeners)}
                className={`mt-1 touch-none shrink-0 p-1 rounded transition-colors ${
                  isNotEditable
                    ? "cursor-not-allowed opacity-40"
                    : "cursor-grab active:cursor-grabbing hover:bg-accent"
                }`}
                onClick={(e) => e.preventDefault()} // Don't navigate when clicking drag handle
                aria-label={isNotEditable ? "Cannot reorder active subtask" : "Drag to reorder"}
                disabled={isNotEditable}
              >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </button>

              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-sm font-semibold text-primary">
                  {index + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className={`text-lg flex-1 ${isDone ? "line-through" : ""}`}>
                    {subtask.name}
                  </CardTitle>
                  <div className="flex gap-2 shrink-0">
                    <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                      {statusConfig.icon}
                      {statusConfig.label}
                    </Badge>
                    <Badge variant={typeConfig.badgeVariant}>
                      {typeConfig.icon} {typeConfig.label}
                    </Badge>
                  </div>
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
 * Renders a group of subtasks with the same status
 */
function SubtaskStatusGroup({
  status,
  subtasks,
  taskId,
  projectId,
  isDragActive,
  onDragStart,
  onDragEnd,
}: {
  status: Status;
  subtasks: Subtask[];
  taskId: string;
  projectId: string;
  isDragActive: boolean;
  onDragStart: () => void;
  onDragEnd: (event: DragEndEvent) => void;
}) {
  const statusLabels = {
    [Status.OPEN]: "Open",
    [Status.IN_PROGRESS]: "In Progress",
    [Status.DONE]: "Done",
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // For OPEN status, enable drag and drop
  if (status === Status.OPEN) {
    return (
      <div>
        <h3 className="text-xl font-semibold mb-3">
          {statusLabels[status]} ({subtasks.length})
        </h3>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={subtasks.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-4">
              {subtasks.map((subtask, index) => (
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
      </div>
    );
  }

  // For IN_PROGRESS and DONE, just render the items without drag context
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">
        {statusLabels[status]} ({subtasks.length})
      </h3>
      <div className="grid gap-4">
        {subtasks.map((subtask, index) => (
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
    </div>
  );
}

/**
 * Main component that renders a list of draggable subtasks grouped by status
 *
 * Key Features:
 * 1. Groups subtasks by status (OPEN, IN_PROGRESS, DONE)
 * 2. Uses useOptimistic for instant UI updates (optimistic updates)
 * 3. Uses useTransition to track pending state
 * 4. Only OPEN subtasks are draggable
 * 5. Maintains order within each status group
 */
export function DraggableSubtaskList({
  subtasks,
  taskId,
  projectId,
}: DraggableSubtaskListProps) {
  const [optimisticItems, addOptimistic] = useOptimistic(
    subtasks,
    (_currentState, newItems: Subtask[]) => newItems,
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

    // Only allow reordering within OPEN status
    const openSubtasks = optimisticItems.filter((item) => item.status === Status.OPEN);
    const oldIndex = openSubtasks.findIndex((item) => item.id === active.id);
    const newIndex = openSubtasks.findIndex((item) => item.id === over.id);

    // Calculate the new order for OPEN subtasks
    const reorderedOpenSubtasks = arrayMove(openSubtasks, oldIndex, newIndex);

    // Merge with other status subtasks
    const otherSubtasks = optimisticItems.filter((item) => item.status !== Status.OPEN);
    const newItems = [...reorderedOpenSubtasks, ...otherSubtasks];

    startTransition(async () => {
      addOptimistic(newItems);

      const result = await reorderSubtasksAction(
        taskId,
        projectId,
        newItems.map((item) => item.id),
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

  // Group subtasks by status
  const groupedSubtasks = {
    [Status.OPEN]: optimisticItems.filter((item) => item.status === Status.OPEN),
    [Status.IN_PROGRESS]: optimisticItems.filter((item) => item.status === Status.IN_PROGRESS),
    [Status.DONE]: optimisticItems.filter((item) => item.status === Status.DONE),
  };

  return (
    <>
      <div className="space-y-8">
        {[Status.OPEN, Status.IN_PROGRESS, Status.DONE].map((status) => {
          const subtasksInStatus = groupedSubtasks[status];
          if (subtasksInStatus.length === 0) return null;

          return (
            <SubtaskStatusGroup
              key={status}
              status={status}
              subtasks={subtasksInStatus}
              taskId={taskId}
              projectId={projectId}
              isDragActive={isDragActive}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          );
        })}
      </div>

      {isPending && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-lg px-4 py-2 shadow-lg">
          <p className="text-sm text-muted-foreground">Saving new order...</p>
        </div>
      )}
    </>
  );
}
