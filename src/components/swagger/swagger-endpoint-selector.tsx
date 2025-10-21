"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import type { SwaggerEndpoint } from "@/lib/services/swagger-service";

interface SwaggerEndpointSelectorProps {
  endpoints: SwaggerEndpoint[];
  value?: SwaggerEndpoint | null;
  onValueChange?: (endpoint: SwaggerEndpoint | null) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-blue-500",
  POST: "bg-green-500",
  PUT: "bg-yellow-500",
  PATCH: "bg-orange-500",
  DELETE: "bg-red-500",
  OPTIONS: "bg-gray-500",
  HEAD: "bg-purple-500",
};

export function SwaggerEndpointSelector({
  endpoints,
  value,
  onValueChange,
  placeholder = "Select endpoint...",
  emptyText = "No endpoints found.",
  disabled = false,
  loading = false,
  className,
}: SwaggerEndpointSelectorProps) {
  const [open, setOpen] = React.useState(false);

  // Group endpoints by tag for better organization
  const groupedEndpoints = React.useMemo(() => {
    const groups: Record<string, SwaggerEndpoint[]> = {};

    endpoints.forEach((endpoint) => {
      if (!endpoint.tags || endpoint.tags.length === 0) {
        if (!groups["Untagged"]) {
          groups["Untagged"] = [];
        }
        groups["Untagged"].push(endpoint);
      } else {
        endpoint.tags.forEach((tag) => {
          if (!groups[tag]) {
            groups[tag] = [];
          }
          groups[tag].push(endpoint);
        });
      }
    });

    return groups;
  }, [endpoints]);

  const handleSelect = (endpoint: SwaggerEndpoint) => {
    const newValue = value?.path === endpoint.path && value?.method === endpoint.method
      ? null
      : endpoint;
    onValueChange?.(newValue);
    setOpen(false);
  };

  const getEndpointLabel = (endpoint: SwaggerEndpoint) => {
    return `${endpoint.method} ${endpoint.path}`;
  };

  const getEndpointSearchValue = (endpoint: SwaggerEndpoint) => {
    return `${endpoint.method} ${endpoint.path} ${endpoint.summary || ""} ${endpoint.description || ""} ${endpoint.tags?.join(" ") || ""}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled || loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading endpoints...
            </span>
          ) : value ? (
            <span className="flex items-center gap-2">
              <Badge
                className={cn(
                  "text-white",
                  METHOD_COLORS[value.method] || "bg-gray-500"
                )}
              >
                {value.method}
              </Badge>
              <span className="truncate">{value.path}</span>
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search endpoints..." />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {Object.entries(groupedEndpoints).map(([tag, tagEndpoints]) => (
              <CommandGroup key={tag} heading={tag}>
                {tagEndpoints.map((endpoint) => {
                  const isSelected =
                    value?.path === endpoint.path &&
                    value?.method === endpoint.method;

                  return (
                    <CommandItem
                      key={`${endpoint.method}-${endpoint.path}`}
                      value={getEndpointSearchValue(endpoint)}
                      onSelect={() => handleSelect(endpoint)}
                      className="flex items-center gap-2 py-3"
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <Badge
                        className={cn(
                          "text-white text-xs",
                          METHOD_COLORS[endpoint.method] || "bg-gray-500"
                        )}
                      >
                        {endpoint.method}
                      </Badge>
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="font-mono text-sm truncate">
                          {endpoint.path}
                        </span>
                        {endpoint.summary && (
                          <span className="text-xs text-muted-foreground truncate">
                            {endpoint.summary}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
