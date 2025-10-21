"use client";

/**
 * DraggableSubtaskList Component
 *
 * This component provides a drag-and-drop interface for reordering subtasks.
 * It uses two main libraries:
 *
 * 1. @dnd-kit - A modern drag-and-drop library for React that handles:
 *    - Touch and mouse interactions
 *    - Keyboard navigation for accessibility
 *    - Smooth animations and transitions
 *    - Collision detection (figuring out where to drop items)
 *
 * 2. useOptimistic (React 19) - A React hook for optimistic UI updates:
 *    - Shows immediate feedback when user drags items
 *    - Automatically reverts if the server action fails
 *    - No manual rollback logic needed
 *
 * User Flow:
 * 1. User drags a subtask to a new position
 * 2. UI updates immediately (optimistic update)
 * 3. Server action saves the new order in the database
 * 4. If successful, the optimistic state becomes the real state
 * 5. If failed, React automatically reverts to the previous state
 */

import { useOptimistic, useTransition } from "react";

// @dnd-kit/core - Core drag-and-drop functionality
import {
  DndContext,          // Provider component that enables drag-and-drop for its children
  closestCenter,       // Algorithm to detect which item is closest to the dragged item
  KeyboardSensor,      // Enables keyboard controls for accessibility (arrow keys, space, etc.)
  PointerSensor,       // Handles mouse and touch drag events
  useSensor,           // Hook to configure individual sensors (input methods)
  useSensors,          // Hook to combine multiple sensors
  DragEndEvent,        // TypeScript type for the event when dragging ends
} from "@dnd-kit/core";

// @dnd-kit/sortable - Utilities specifically for sortable lists
import {
  arrayMove,                      // Helper function to move an item from one index to another
  SortableContext,                // Provider that manages the sortable list state
  sortableKeyboardCoordinates,    // Coordinate system for keyboard navigation
  useSortable,                    // Hook that makes an individual item draggable/sortable
  verticalListSortingStrategy,    // Strategy for vertical lists (vs horizontal, grid, etc.)
} from "@dnd-kit/sortable";

// @dnd-kit/utilities - CSS and transform utilities
import { CSS } from "@dnd-kit/utilities";  // Helpers for CSS transforms during dragging

// UI Components
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";  // Icon for the drag handle

// Routing and Actions
import { TypedLink } from "@/lib/routes";
import { routes } from "@/lib/routes";
import { getTypeConfig } from "@/features/subtasks/config/type-config";
import { reorderSubtasks } from "@/lib/actions/subtask-actions";  // Server action to save order

// Notifications
import { toast } from "sonner";  // Toast notifications for user feedback

// Types
import { SubtaskType } from "@/features/subtasks/types/subtask-types";

// ============================================================================
// TypeScript Interfaces
// ============================================================================

/**
 * Subtask data structure
 * Contains all the information needed to display a subtask
 */
interface Subtask {
  id: string;          // Unique identifier for the subtask
  name: string;        // Display name/title
  content: string;     // Full markdown content (we show a preview)
  type: SubtaskType;   // Type of subtask (GENERIC, FORM, etc.)
  order: number;       // Current position in the list (0-indexed)
}

/**
 * Props for the main DraggableSubtaskList component
 */
interface DraggableSubtaskListProps {
  subtasks: Subtask[];  // Array of subtasks to display (comes from server)
  taskId: string;       // ID of the parent task
  projectId: string;    // ID of the parent project (needed for routing)
}

/**
 * Props for individual sortable subtask items
 */
interface SortableSubtaskItemProps {
  subtask: Subtask;    // The subtask data to display
  index: number;       // Current position in the list (used for numbering: 1, 2, 3...)
  projectId: string;   // Needed for navigation links
  taskId: string;      // Needed for navigation links
}

// ============================================================================
// SortableSubtaskItem Component
// ============================================================================

/**
 * Individual subtask item that can be dragged and reordered
 *
 * This component uses the useSortable hook from @dnd-kit/sortable to make
 * each subtask draggable. The hook provides everything needed to:
 * - Track drag state (is it being dragged?)
 * - Apply transform animations (smooth movement)
 * - Handle accessibility (keyboard navigation)
 */
function SortableSubtaskItem({ subtask, index, projectId, taskId }: SortableSubtaskItemProps) {
  /**
   * useSortable Hook
   *
   * This hook connects this component to the sortable system.
   * It returns several key pieces:
   *
   * - attributes: Accessibility attributes (aria-*, role, etc.) for screen readers
   * - listeners: Event handlers for drag interactions (onPointerDown, onKeyDown, etc.)
   * - setNodeRef: A ref to attach to the draggable element
   * - transform: Current position offset during dragging (x, y coordinates)
   * - transition: CSS transition for smooth animations
   * - isDragging: Boolean indicating if this item is currently being dragged
   */
  const {
    attributes,    // Spread these on the drag handle for accessibility
    listeners,     // Spread these on the drag handle to enable dragging
    setNodeRef,    // Attach to the root element to track its position
    transform,     // Applied as CSS transform for smooth drag animation
    transition,    // CSS transition for smooth movement
    isDragging,    // True when this item is being dragged
  } = useSortable({ id: subtask.id });

  /**
   * Style object for drag animations
   *
   * - transform: Moves the item smoothly as it's dragged
   * - transition: Provides smooth animation between positions
   * - opacity: Makes the item semi-transparent while dragging (visual feedback)
   */
  const style = {
    transform: CSS.Transform.toString(transform),  // Convert transform object to CSS string
    transition,                                     // Apply the transition from useSortable
    opacity: isDragging ? 0.5 : 1,                 // Fade out when dragging for visual feedback
  };

  // Get display configuration for this subtask type (icon, label, badge color)
  const typeConfig = getTypeConfig(subtask.type);

  return (
    // Root div: Attach the sortable ref and drag styles here
    <div ref={setNodeRef} style={style} className="relative group">
      {/*
        TypedLink: Makes the entire card clickable to edit the subtask
        Note: The drag handle (button below) prevents clicks from bubbling
      */}
      <TypedLink
        route={routes.projects.tasks.subtasks.edit}
        params={{ projectId, taskId, subtaskId: subtask.id }}
        className="block"
      >
        <Card className="hover:border-primary transition-colors cursor-pointer">
          <CardHeader>
            <div className="flex items-start gap-3">
              {/*
                DRAG HANDLE
                This button is the draggable area. Users grab this to reorder.
                - {...attributes}: Adds accessibility attributes
                - {...listeners}: Adds drag event handlers (onPointerDown, etc.)
                - onClick preventDefault: Stops the button click from triggering the link
                - touch-none: Prevents touch scrolling while dragging on mobile
              */}
              <button
                {...attributes}
                {...listeners}
                className="mt-1 cursor-grab active:cursor-grabbing touch-none flex-shrink-0 p-1 hover:bg-accent rounded transition-colors"
                onClick={(e) => e.preventDefault()}  // Don't navigate when clicking drag handle
                aria-label="Drag to reorder"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </button>

              {/*
                ORDER NUMBER BADGE
                Shows the current position (1, 2, 3, etc.)
                This updates automatically as items are reordered
              */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-sm font-semibold text-primary">
                  {index + 1}  {/* Display 1-indexed position (not 0-indexed) */}
                </span>
              </div>

              {/* SUBTASK CONTENT */}
              <div className="flex-1 min-w-0">
                {/* Title and Type Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-lg flex-1">{subtask.name}</CardTitle>
                  <Badge variant={typeConfig.badgeVariant} className="shrink-0">
                    {typeConfig.icon} {typeConfig.label}
                  </Badge>
                </div>
                {/* Content Preview (first 200 characters) */}
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

// ============================================================================
// Main DraggableSubtaskList Component
// ============================================================================

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
  /**
   * useOptimistic Hook (React 19)
   *
   * This is the modern React way to handle optimistic UI updates.
   *
   * How it works:
   * 1. Takes the current state (subtasks from props)
   * 2. Takes an update function that calculates the optimistic state
   * 3. Returns [optimisticState, addOptimistic]
   *
   * When you call addOptimistic(newItems):
   * - optimisticItems immediately updates to show newItems
   * - Your async action runs in the background
   * - When the action completes, React automatically:
   *   - Uses the new data from the server (if successful)
   *   - OR reverts to the original state (if it fails)
   *
   * Benefits over manual useState:
   * - No need to manually revert on error
   * - No need for isLoading state
   * - Automatically handles concurrent updates
   * - Built-in race condition handling
   */
  const [optimisticItems, addOptimistic] = useOptimistic(
    subtasks,  // The source of truth (from server)
    (_currentState, newItems: Subtask[]) => newItems  // How to calculate optimistic state
  );

  /**
   * useTransition Hook
   *
   * Tracks whether an async transition is pending.
   * We use this to show a loading indicator while the server action runs.
   *
   * Returns:
   * - isPending: true while the async action is running
   * - startTransition: wrapper function for async updates
   */
  const [isPending, startTransition] = useTransition();

  /**
   * Sensors Configuration
   *
   * Sensors are how @dnd-kit detects drag interactions.
   * We configure two sensors:
   *
   * 1. PointerSensor - Handles mouse and touch events
   *    - activationConstraint.distance: 8px
   *      User must drag at least 8px before drag starts
   *      This prevents accidental drags when clicking
   *
   * 2. KeyboardSensor - Handles keyboard navigation (accessibility)
   *    - sortableKeyboardCoordinates: arrow keys to move items
   *    - Space to pick up/drop items
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,  // Require 8px movement before drag starts (prevents accidental drags)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,  // Maps arrow keys to movement
    })
  );

  /**
   * handleDragEnd
   *
   * Called when user finishes dragging an item.
   * This is where we handle the reordering logic.
   *
   * Flow:
   * 1. Calculate new order based on where item was dropped
   * 2. Optimistically update UI with addOptimistic()
   * 3. Call server action to save the new order
   * 4. Show success/error toast
   * 5. React automatically handles reverting if it fails
   */
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // If dropped outside the list or in the same position, do nothing
    if (!over || active.id === over.id) {
      return;
    }

    // Find the old and new positions
    const oldIndex = optimisticItems.findIndex((item) => item.id === active.id);
    const newIndex = optimisticItems.findIndex((item) => item.id === over.id);

    // Calculate the new order using arrayMove helper
    // arrayMove([A, B, C, D], 0, 2) => [B, C, A, D]
    const newItems = arrayMove(optimisticItems, oldIndex, newIndex);

    // Start the transition (sets isPending = true)
    startTransition(async () => {
      // STEP 1: Optimistically update the UI
      // This happens instantly - users see the change immediately
      addOptimistic(newItems);

      // STEP 2: Call the server action to persist the change
      // This runs in the background while the UI already shows the new order
      const result = await reorderSubtasks(
        taskId,
        newItems.map((item) => item.id)  // Send array of IDs in new order
      );

      // STEP 3: Show feedback to the user
      if (result.error) {
        // If the server action failed, React automatically reverts the UI
        // We just need to show an error message
        toast.error("Failed to reorder subtasks", {
          description: result.error,
        });
      } else {
        // Success! The optimistic state is now the real state
        toast.success("Subtasks reordered successfully");
      }
    });
    // Note: No need for try/catch or manual revert - useOptimistic handles it!
  }

  /**
   * Render the drag-and-drop interface
   *
   * Component Tree:
   * 1. DndContext - Top-level provider that enables drag-and-drop
   * 2. SortableContext - Manages the sortable list
   * 3. Individual SortableSubtaskItems - The draggable items
   * 4. Loading indicator (shown while server action is pending)
   */
  return (
    <>
      {/*
        DndContext Provider

        This is the top-level provider from @dnd-kit that enables drag-and-drop
        for all children. It coordinates:
        - Sensor activation (mouse, touch, keyboard)
        - Collision detection (which item is being hovered?)
        - Drag events (onDragStart, onDragMove, onDragEnd)

        Props:
        - sensors: Array of input methods (mouse, touch, keyboard)
        - collisionDetection: Algorithm to find drop targets
        - onDragEnd: Callback when drag finishes
      */}
      <DndContext
        sensors={sensors}                    // Mouse, touch, and keyboard sensors
        collisionDetection={closestCenter}   // Drop on the closest item
        onDragEnd={handleDragEnd}            // Handle reordering when drag ends
      >
        {/*
          SortableContext Provider

          Manages the sortable list state. Must wrap all sortable items.
          Uses the verticalListSortingStrategy for optimal vertical list performance.

          Props:
          - items: Array of IDs for the sortable items
          - strategy: Layout strategy (vertical, horizontal, grid, etc.)
        */}
        <SortableContext
          items={optimisticItems.map((item) => item.id)}  // Use optimistic state for instant updates
          strategy={verticalListSortingStrategy}           // Optimized for vertical lists
        >
          {/* Container for the list */}
          <div className="grid gap-4">
            {/*
              Render each subtask as a SortableSubtaskItem
              Using optimisticItems ensures the UI updates instantly on drag
            */}
            {optimisticItems.map((subtask, index) => (
              <SortableSubtaskItem
                key={subtask.id}        // Stable key for React reconciliation
                subtask={subtask}       // Subtask data
                index={index}           // Position for numbering (1, 2, 3...)
                projectId={projectId}   // For navigation
                taskId={taskId}         // For navigation
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/*
        Loading Indicator

        Shows a fixed toast-like notification while the server action is running.
        isPending comes from useTransition and is true while saving to server.
      */}
      {isPending && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-lg px-4 py-2 shadow-lg">
          <p className="text-sm text-muted-foreground">Saving new order...</p>
        </div>
      )}
    </>
  );
}
