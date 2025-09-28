"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "./table";

interface TableSkeletonProps {
  columns: number;
  rows: number;
}

export function TableSkeleton({ columns, rows }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={`skeleton-row-${rowIndex}`}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
              <div className="h-12 w-full flex items-center justify-center">
                <Skeleton className="h-8 w-full" />
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}