"use client";

import { useState } from "react";
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
import { SubtaskType } from "@/features/subtasks/types/subtask-types";

interface Subtask {
  id: string;
  name: string;
  content: string;
  type: SubtaskType;
  order: number;
}

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
}

function SortableSubtaskItem({ subtask, index, projectId, taskId }: SortableSubtaskItemProps) {
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
      >
        <Card className="hover:border-primary transition-colors cursor-pointer">
          <CardHeader>
            <div className="flex items-start gap-3">
              {/* Drag Handle */}
              <button
                {...attributes}
                {...listeners}
                className="mt-1 cursor-grab active:cursor-grabbing touch-none flex-shrink-0 p-1 hover:bg-accent rounded transition-colors"
                onClick={(e) => e.preventDefault()}
                aria-label="Drag to reorder"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </button>

              {/* Order Number */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-sm font-semibold text-primary">
                  {index + 1}
                </span>
              </div>

              {/* Content */}
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

export function DraggableSubtaskList({ subtasks, taskId, projectId }: DraggableSubtaskListProps) {
  const [items, setItems] = useState(subtasks);
  const [isReordering, setIsReordering] = useState(false);

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

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);

    // Optimistically update UI
    setItems(newItems);
    setIsReordering(true);

    try {
      // Call server action to persist the new order
      const result = await reorderSubtasks(
        taskId,
        newItems.map((item) => item.id)
      );

      if (result.error) {
        // Revert on error
        setItems(items);
        toast.error("Failed to reorder subtasks", {
          description: result.error,
        });
      } else {
        toast.success("Subtasks reordered successfully");
      }
    } catch (error) {
      // Revert on error
      setItems(items);
      toast.error("Failed to reorder subtasks", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsReordering(false);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="grid gap-4">
          {items.map((subtask, index) => (
            <SortableSubtaskItem
              key={subtask.id}
              subtask={subtask}
              index={index}
              projectId={projectId}
              taskId={taskId}
            />
          ))}
        </div>
      </SortableContext>
      {isReordering && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-lg px-4 py-2 shadow-lg">
          <p className="text-sm text-muted-foreground">Saving new order...</p>
        </div>
      )}
    </DndContext>
  );
}
