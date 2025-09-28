"use client";

import { type Column } from "@tanstack/react-table";
import {
  IconArrowUp,
  IconArrowDown,
  IconArrowsSort,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function TableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: TableColumnHeaderProps<TData, TValue>) {
  const handleSort = () => {
    column.toggleSorting(column.getIsSorted() === "asc");
  };

  if (!column.getCanSort()) {
    return (
      <div className={cn(className)}>
        <span className="text-sm">{title}</span>
      </div>
    );
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      className="-ml-2 shadow-none"
      onClick={handleSort}
    >
      <span className="text-sm">{title}</span>
      {column.getIsSorted() === "desc" ? (
        <IconArrowDown />
      ) : column.getIsSorted() === "asc" ? (
        <IconArrowUp />
      ) : (
        <IconArrowsSort />
      )}
    </Button>
  );
}
