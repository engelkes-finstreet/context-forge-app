"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SelectOptionsManagerProps {
  options: string[];
  onChange: (options: string[]) => void;
}

/**
 * Component for managing options in a select field
 */
export function SelectOptionsManager({
  options,
  onChange,
}: SelectOptionsManagerProps) {
  const [newOption, setNewOption] = useState("");

  const handleAddOption = () => {
    const trimmed = newOption.trim();
    if (trimmed && !options.includes(trimmed)) {
      onChange([...options, trimmed]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (optionToRemove: string) => {
    onChange(options.filter((opt) => opt !== optionToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddOption();
    }
  };

  return (
    <div className="space-y-3">
      {/* Add new option input */}
      <div className="flex gap-2">
        <Input
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add an option..."
        />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={handleAddOption}
          disabled={!newOption.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Display current options */}
      {options.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {options.map((option, idx) => (
            <Badge key={idx} variant="secondary" className="gap-1 pr-1">
              {option}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveOption(option)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No options added yet. Add at least one option.
        </p>
      )}
    </div>
  );
}
