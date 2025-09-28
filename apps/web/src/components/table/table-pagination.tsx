import { type Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZES } from "@/config/constants";
import { useTranslations } from "next-intl";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  enableRowSelection?: boolean;
}

export function TablePagination<TData>({
  table,
  enableRowSelection,
}: TablePaginationProps<TData>) {
  const t = useTranslations("pagination");
  const { rowSelection } = table.getState();
  const selectedCount = Object.keys(rowSelection).length;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const total = table.options.meta?.total || 0;

  return (
    <div className="px-4 py-3">
      <div className="flex flex-col @[800px]:flex-row items-center @[800px]:justify-between gap-4 w-full">
        <div className="flex flex-col @[800px]:flex-row items-center gap-4 @[800px]:gap-8 order-3 @[800px]:order-1">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value: string) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[80px] cursor-pointer">
              <SelectValue
                placeholder={`${table.getState().pagination.pageSize}`}
              />
            </SelectTrigger>
            <SelectContent side="top">
              {PAGE_SIZES.map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={`${pageSize}`}
                  className="cursor-pointer"
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-4 text-sm text-foreground">
            {enableRowSelection ? (
              <p className="font-medium whitespace-nowrap">
                {t("infoSelected", {
                  selected: selectedCount,
                  total: table.options.meta?.total || 0,
                })}
              </p>
            ) : (
              <p className="font-medium whitespace-nowrap">
                {t("info", {
                  start: (currentPage - 1) * pageSize + 1,
                  end: Math.min(currentPage * pageSize, total),
                  total,
                })}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 order-1 @[800px]:order-2">
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-foreground whitespace-nowrap">
              <span>
                {t("page", {
                  page: table.getState().pagination.pageIndex + 1,
                  totalPages: table.getPageCount(),
                })}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="iconPagination"
                onClick={() => {
                  table.setPageIndex(0);
                }}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">{t("firstPage")}</span>
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                size="iconPagination"
                onClick={() => {
                  const newIndex = table.getState().pagination.pageIndex - 1;
                  table.setPageIndex(newIndex);
                }}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">{t("previousPage")}</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="iconPagination"
                onClick={() => {
                  const newIndex = table.getState().pagination.pageIndex + 1;
                  table.setPageIndex(newIndex);
                }}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">{t("nextPage")}</span>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                size="iconPagination"
                onClick={() => {
                  const newIndex = table.getPageCount() - 1;
                  table.setPageIndex(newIndex);
                }}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">{t("lastPage")}</span>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
