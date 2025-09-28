"use client";

import { type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  title: string;
  description?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  value,
  title,
  description,
  className = "",
}: StatCardProps) {
  return (
    <Card className={cn("gap-1 lg:gap-3", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground lg:min-h-[2.5rem] flex items-center leading-tight">
          {title}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>}
      </CardContent>
    </Card>
  );
}
