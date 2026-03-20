import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge, DateTimeCell, ActionCell, ActionIcons } from "./shared";
import type { Quiz, Assignment, QuizSubmission, AssignmentSubmission } from "@/types";

// Quiz columns
export const quizColumns: ColumnDef<Quiz>[] = [
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
    accessorKey: "time_limit",
    header: "Time Limit",
    cell: ({ row }) => <span>{row.original.time_limit} mins</span>,
  },
  {
    id: "questions",
    header: "Questions",
    cell: ({ row }) => <span>{row.original.questions?.length || 0}</span>,
  },
  {
    accessorKey: "availability_start",
    header: "Available From",
    cell: ({ row }) => <DateTimeCell date={row.original.availability_start} />,
  },
  {
    accessorKey: "availability_end",
    header: "Available Until",
    cell: ({ row }) => <DateTimeCell date={row.original.availability_end} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
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

// Assignment columns
export const assignmentColumns: ColumnDef<Assignment>[] = [
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
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => <DateTimeCell date={row.original.due_date} />,
  },
  {
    id: "questions",
    header: "Questions",
    cell: ({ row }) => <span>{row.original.questions?.length || 0}</span>,
  },
  {
    id: "late_submission",
    header: "Late Submission",
    cell: ({ row }) => (
      <span className={row.original.allow_late_submission ? "text-green-600" : "text-red-600"}>
        {row.original.allow_late_submission ? "Allowed" : "Not Allowed"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
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

// Quiz submission columns
export const quizSubmissionColumns: ColumnDef<QuizSubmission>[] = [
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

// Assignment submission columns
export const assignmentSubmissionColumns: ColumnDef<AssignmentSubmission>[] = [
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
    id: "is_late",
    header: "Late",
    cell: ({ row }) => (
      <span className={row.original.is_late ? "text-red-600" : "text-green-600"}>
        {row.original.is_late ? "Yes" : "No"}
      </span>
    ),
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
    accessorKey: "submitted_at",
    header: "Submitted At",
    cell: ({ row }) => <DateTimeCell date={row.original.submitted_at} />,
  },
];
