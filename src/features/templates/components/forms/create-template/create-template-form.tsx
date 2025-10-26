"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubtaskType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/lib/toast";
import { createTemplateFormAction } from "./create-template-form-action";
import { getTypeConfig } from "@/features/subtasks/config/type-config";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { SubtaskTemplateInput } from "./create-template-form-schema";

export function CreateTemplateForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subtaskTemplates, setSubtaskTemplates] = useState<
    SubtaskTemplateInput[]
  >([
    {
      name: "",
      type: SubtaskType.GENERIC,
      content: "",
      metadata: null,
      order: 0,
      required: true,
    },
  ]);

  const addSubtaskTemplate = () => {
    setSubtaskTemplates([
      ...subtaskTemplates,
      {
        name: "",
        type: SubtaskType.GENERIC,
        content: "",
        metadata: null,
        order: subtaskTemplates.length,
        required: true,
      },
    ]);
  };

  const removeSubtaskTemplate = (index: number) => {
    const newTemplates = subtaskTemplates.filter((_, i) => i !== index);
    // Reorder
    newTemplates.forEach((st, i) => {
      st.order = i;
    });
    setSubtaskTemplates(newTemplates);
  };

  const updateSubtaskTemplate = (
    index: number,
    field: keyof SubtaskTemplateInput,
    value: any
  ) => {
    const newTemplates = [...subtaskTemplates];
    newTemplates[index] = { ...newTemplates[index], [field]: value };
    setSubtaskTemplates(newTemplates);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createTemplateFormAction(
        { error: null, message: null },
        {
          name,
          description: description || null,
          subtaskTemplates,
        }
      );

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Template created successfully");
      }
    } catch (error) {
      toast.error("Failed to create template");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Template Details */}
      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
          <CardDescription>
            Basic information about your task template
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Inquiry Process, CRUD Feature"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this template is for..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Subtask Templates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Subtask Templates</h3>
            <p className="text-sm text-muted-foreground">
              Define the subtasks that will be created when using this template
            </p>
          </div>
          <Button type="button" onClick={addSubtaskTemplate} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Subtask
          </Button>
        </div>

        {subtaskTemplates.map((subtaskTemplate, index) => {
          const typeConfig = getTypeConfig(subtaskTemplate.type);
          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base">
                      Subtask {index + 1}
                    </CardTitle>
                  </div>
                  {subtaskTemplates.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubtaskTemplate(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`subtask-name-${index}`}>Name</Label>
                    <Input
                      id={`subtask-name-${index}`}
                      value={subtaskTemplate.name}
                      onChange={(e) =>
                        updateSubtaskTemplate(index, "name", e.target.value)
                      }
                      placeholder="e.g., Setup Configuration"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`subtask-type-${index}`}>Type</Label>
                    <Select
                      value={subtaskTemplate.type}
                      onValueChange={(value) =>
                        updateSubtaskTemplate(
                          index,
                          "type",
                          value as SubtaskType
                        )
                      }
                    >
                      <SelectTrigger id={`subtask-type-${index}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(SubtaskType).map((type) => {
                          const config = getTypeConfig(type);
                          return (
                            <SelectItem key={type} value={type}>
                              {config.icon} {config.label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`subtask-content-${index}`}>Content</Label>
                  <Textarea
                    id={`subtask-content-${index}`}
                    value={subtaskTemplate.content}
                    onChange={(e) =>
                      updateSubtaskTemplate(index, "content", e.target.value)
                    }
                    placeholder="Initial content for this subtask..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`subtask-required-${index}`}
                    checked={subtaskTemplate.required}
                    onCheckedChange={(checked) =>
                      updateSubtaskTemplate(
                        index,
                        "required",
                        checked === true
                      )
                    }
                  />
                  <Label
                    htmlFor={`subtask-required-${index}`}
                    className="text-sm font-normal"
                  >
                    Required subtask
                  </Label>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {subtaskTemplates.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground mb-4">
                No subtask templates yet
              </p>
              <Button type="button" onClick={addSubtaskTemplate}>
                Add First Subtask Template
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Template"}
        </Button>
      </div>
    </form>
  );
}
