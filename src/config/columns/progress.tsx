import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge, DateCell, PercentageCell, ActionCell, ActionIcons } from "./shared";
import type { Progress, ReportCard } from "@/types";

// Progress columns
export const progressColumns: ColumnDef<Progress>[] = [
  {
    accessorKey: "student_id",
    header: "Student",
    cell: ({ row }) => <span>{row.original.student_id}</span>,
  },
  {
    accessorKey: "course_id",
    header: "Course",
    cell: ({ row }) => <span>{row.original.course_id}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "grade",
    header: "Grade",
    cell: ({ row }) => {
      const grade = row.original.grade;
      if (!grade) return <span className="text-gray-400">N/A</span>;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{grade.letter_grade}</span>
          <span className="text-xs text-gray-500">{grade.percentage.toFixed(1)}%</span>
        </div>
      );
    },
  },
  {
    id: "attendance",
    header: "Attendance",
    cell: ({ row }) => <PercentageCell value={row.original.attendance?.percentage || 0} showBar />,
  },
  {
    id: "is_flagged",
    header: "Flagged",
    cell: ({ row }) => (
      <span className={row.original.is_flagged ? "font-medium text-red-600" : "text-gray-400"}>
        {row.original.is_flagged ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "class_position",
    header: "Position",
    cell: ({ row }) => <span>{row.original.class_position || "N/A"}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell
        actions={[
          { label: "View Details", icon: ActionIcons.View, onClick: () => console.log("View", row.original.id) },
          { label: "Edit", icon: ActionIcons.Edit, onClick: () => console.log("Edit", row.original.id) },
        ]}
      />
    ),
  },
];

// Report card columns
export const reportCardColumns: ColumnDef<ReportCard>[] = [
  {
    accessorKey: "student_id",
    header: "Student",
    cell: ({ row }) => <span>{row.original.student_id}</span>,
  },
  {
    accessorKey: "term_id",
    header: "Term",
    cell: ({ row }) => <span>{row.original.term_id}</span>,
  },
  {
    accessorKey: "class_id",
    header: "Class",
    cell: ({ row }) => <span>{row.original.class_id}</span>,
  },
  {
    accessorKey: "overall_grade",
    header: "Grade",
    cell: ({ row }) => <span className="font-medium">{row.original.overall_grade}</span>,
  },
  {
    accessorKey: "overall_percentage",
    header: "Percentage",
    cell: ({ row }) => <PercentageCell value={row.original.overall_percentage} showBar />,
  },
  {
    id: "position",
    header: "Position",
    cell: ({ row }) => (
      <span>
        {row.original.class_position}/{row.original.total_students}
      </span>
    ),
  },
  {
    accessorKey: "generated_at",
    header: "Generated At",
    cell: ({ row }) => <DateCell date={row.original.generated_at} />,
  },
  {
    id: "pdf",
    header: "PDF",
    cell: ({ row }) => (
      <span className={row.original.pdf_url ? "text-green-600" : "text-gray-400"}>
        {row.original.pdf_url ? "Available" : "N/A"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell
        actions={[
          { label: "View Report", icon: ActionIcons.View, onClick: () => console.log("View", row.original.id) },
        ]}
      />
    ),
  },
];
