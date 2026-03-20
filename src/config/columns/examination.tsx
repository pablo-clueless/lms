import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge, DateTimeCell, ActionCell, ActionIcons } from "./shared";
import type { Examination, ExaminationSubmission } from "@/types";

// Examination columns
export const examinationColumns: ColumnDef<Examination>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
  },
  {
    accessorKey: "total_marks",
    header: "Total Marks",
    cell: ({ row }) => <span>{row.original.total_marks}</span>,
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => <span>{row.original.duration} mins</span>,
  },
  {
    id: "questions",
    header: "Questions",
    cell: ({ row }) => <span>{row.original.questions?.length || 0}</span>,
  },
  {
    accessorKey: "window_start",
    header: "Window Start",
    cell: ({ row }) => <DateTimeCell date={row.original.window_start} />,
  },
  {
    accessorKey: "window_end",
    header: "Window End",
    cell: ({ row }) => <DateTimeCell date={row.original.window_end} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "results_published",
    header: "Results",
    cell: ({ row }) => (
      <span className={row.original.results_published ? "text-green-600" : "text-gray-400"}>
        {row.original.results_published ? "Published" : "Not Published"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell
        actions={[
          { label: "View Details", icon: ActionIcons.View, onClick: () => console.log("View", row.original.id) },
          { label: "Edit", icon: ActionIcons.Edit, onClick: () => console.log("Edit", row.original.id) },
          {
            label: "Delete",
            icon: ActionIcons.Delete,
            onClick: () => console.log("Delete", row.original.id),
            variant: "danger",
          },
        ]}
      />
    ),
  },
];

// Examination submission columns
export const examinationSubmissionColumns: ColumnDef<ExaminationSubmission>[] = [
  {
    accessorKey: "student_id",
    header: "Student",
    cell: ({ row }) => <span>{row.original.student_id}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => <span>{row.original.score ?? "N/A"}</span>,
  },
  {
    accessorKey: "percentage",
    header: "Percentage",
    cell: ({ row }) => <span>{row.original.percentage ? `${row.original.percentage.toFixed(1)}%` : "N/A"}</span>,
  },
  {
    id: "auto_submitted",
    header: "Auto Submitted",
    cell: ({ row }) => (
      <span className={row.original.auto_submitted ? "text-yellow-600" : "text-green-600"}>
        {row.original.auto_submitted ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "started_at",
    header: "Started At",
    cell: ({ row }) => <DateTimeCell date={row.original.started_at} />,
  },
  {
    accessorKey: "submitted_at",
    header: "Submitted At",
    cell: ({ row }) => <DateTimeCell date={row.original.submitted_at} />,
  },
  {
    accessorKey: "graded_at",
    header: "Graded At",
    cell: ({ row }) => <DateTimeCell date={row.original.graded_at} />,
  },
];
