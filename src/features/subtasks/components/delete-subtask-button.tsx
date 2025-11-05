"use client";

import { Button } from "@/components/ui/button";
import { deleteSubtaskAction } from "@/features/subtasks/actions/delete-subtask-action";
import { Loader2 } from "lucide-react";
import { Trash } from "lucide-react";
import { useTransition } from "react";
import { toast } from "@/lib/toast";

export const DeleteSubtaskButton = ({
  subtaskId,
  projectId,
  taskId,
}: {
  subtaskId: string;
  projectId: string;
  taskId: string;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteSubtaskAction(subtaskId, projectId, taskId);
      if (result.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <Button onClick={handleDelete} disabled={isPending} variant="destructive">
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Trash className="size-4" />
      )}
      Delete Subtask
    </Button>
  );
};
