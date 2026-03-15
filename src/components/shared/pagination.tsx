"use client";

import { ArrowLeft01Icon, ArrowLeftDoubleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "../ui/button";

interface Props {
  onPageChange: (page: number) => void;
  onPageSizeChange: (page: number) => void;
  page: number;
  pageSize: number;
  total: number;
}

export const Pagination = ({ onPageChange, page, pageSize, total }: Props) => {
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize + 1;
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
        <Button disabled={page === 1} onClick={handleFirstPage} size="icon">
          <HugeiconsIcon icon={ArrowLeftDoubleIcon} className="size-4" />
        </Button>
        <Button disabled={page === 1} onClick={handlePreviousPage} size="icon">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
        </Button>
        <Button disabled={page === totalPages} onClick={handleNextPage} size="icon">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 rotate-180" />
        </Button>
        <Button disabled={page === totalPages} onClick={handleLastPage} size="icon">
          <HugeiconsIcon icon={ArrowLeftDoubleIcon} className="size-4 rotate-180" />
        </Button>
      </div>
    </div>
  );
};
