"use client";

import { Button } from "@/components/ui/button";
import { useTypedRouter } from "@/lib/routes/hooks";
import { ArrowLeft } from "lucide-react";

interface PageHeaderTitleProps {
  title: string;
  subtitle?: string;
  backLabel?: string;
}

export function PageHeaderTitle({
  title,
  subtitle,
  backLabel,
}: PageHeaderTitleProps) {
  const router = useTypedRouter();

  return (
    <div className="flex flex-col items-start gap-0">
      {backLabel ? (
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backLabel}
        </Button>
      ) : null}
      <h1 className="text-3xl font-bold text-gradient">{title}</h1>
      {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}
