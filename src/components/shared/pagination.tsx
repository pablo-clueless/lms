"use client";

import { ArrowLeft01Icon, ArrowLeftDoubleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

interface Props {
  onPageChange: (page: number) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageSizeChange?: (page: number) => void;
  showPageSize?: boolean;
}

const ROW_SIZES = ["10", "15", "20", "25", "30"];

export const Pagination = ({ onPageChange, page, pageSize, total, onPageSizeChange, showPageSize }: Props) => {
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = page * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  return (
    <div className="flex w-full items-center justify-between py-4">
      <div className="flex items-center gap-x-4">
        <p className="text-sm text-neutral-600">
          {startIndex} to {endIndex} of {total}
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        {showPageSize && (
          <div className="flex items-center gap-x-2">
            <Select onValueChange={(value) => onPageSizeChange?.(Number(value))} value={String(pageSize)}>
              <SelectTrigger className="w-25">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROW_SIZES.map((rowSize) => (
                  <SelectItem key={rowSize} value={rowSize}>
                    {rowSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center gap-x-4">
          <Button disabled={page === 0} onClick={handleFirstPage} size="icon">
            <HugeiconsIcon icon={ArrowLeftDoubleIcon} className="size-4" />
          </Button>
          <Button disabled={page === 0} onClick={handlePreviousPage} size="icon">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          </Button>
          <Button disabled={page === totalPages - 1} onClick={handleNextPage} size="icon">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 rotate-180" />
          </Button>
          <Button disabled={page === totalPages - 1} onClick={handleLastPage} size="icon">
            <HugeiconsIcon icon={ArrowLeftDoubleIcon} className="size-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
};
