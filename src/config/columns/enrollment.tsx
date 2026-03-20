import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge, DateCell, ActionCell, ActionIcons } from "./shared";
import type { Enrollment } from "@/types";

export const enrollmentColumns: ColumnDef<Enrollment>[] = [
  {
    accessorKey: "student_id",
    header: "Student",
    cell: ({ row }) => <span>{row.original.student_id}</span>,
  },
  {
    accessorKey: "class_id",
    header: "Class",
    cell: ({ row }) => <span>{row.original.class_id}</span>,
  },
  {
    accessorKey: "enrollment_date",
    header: "Enrollment Date",
    cell: ({ row }) => <DateCell date={row.original.enrollment_date} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "withdrawal_date",
    header: "Withdrawal Date",
    cell: ({ row }) => <DateCell date={row.original.withdrawal_date} />,
  },
  {
    accessorKey: "created_at",
    header: "Date Created",
    cell: ({ row }) => <DateCell date={row.original.created_at} />,
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
            label: "Withdraw",
            icon: ActionIcons.Delete,
            onClick: () => console.log("Withdraw", row.original.id),
            variant: "danger",
          },
        ]}
      />
    ),
  },
];
