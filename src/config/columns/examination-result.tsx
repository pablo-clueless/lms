"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDateTime, getBasePathByRole, truncateText } from "@/lib";
import type { ExaminationResult, Role } from "@/types";
import { Button } from "@/components/ui/button";

export const createColumns = (role: Role): ColumnDef<ExaminationResult>[] => {
  return [
    {
      accessorKey: "student_id",
      header: "Student",
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.student_id}</span>,
    },
    {
      accessorKey: "examination_id",
      header: "Examination",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{row.original.examination_id}</span>,
    },
    {
      accessorKey: "score",
      header: "Score",
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.score} pts</span>,
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: ({ row }) => {
        const gradeColors: Record<string, string> = {
          A: "bg-emerald-100 text-emerald-700",
          B: "bg-blue-100 text-blue-700",
          C: "bg-amber-100 text-amber-700",
          D: "bg-orange-100 text-orange-700",
          F: "bg-red-100 text-red-700",
        };
        const colorClass = gradeColors[row.original.grade.charAt(0)] ?? "bg-neutral-100 text-neutral-700";
        return (
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>
            {row.original.grade}
          </span>
        );
      },
    },
    {
      accessorKey: "remarks",
      header: "Remarks",
      cell: ({ row }) => (
        <span className="text-sm text-neutral-600">{truncateText(row.original.remarks ?? "-", 30)}</span>
      ),
    },
    {
      accessorKey: "graded_at",
      header: "Graded",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDateTime(row.original.graded_at)}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon-sm" variant="ghost">
              <HugeiconsIcon icon={MoreVerticalIcon} className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-32 p-1">
            <Link
              className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
              href={`${getBasePathByRole(role)}/examination-results/${row.original.id}`}
            >
              View
            </Link>
            <Link
              className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
              href={`${getBasePathByRole(role)}/examination-results/${row.original.id}/edit`}
            >
              Edit
            </Link>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
