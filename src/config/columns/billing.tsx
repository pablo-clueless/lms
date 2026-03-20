import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge, DateCell, CurrencyCell, ActionCell, ActionIcons } from "./shared";
import type { Invoice, Subscription, BillingAdjustment } from "@/types";

// Invoice columns
export const invoiceColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoice_number",
    header: "Invoice #",
    cell: ({ row }) => <span className="font-mono font-medium">{row.original.invoice_number}</span>,
  },
  {
    accessorKey: "total_amount",
    header: "Amount",
    cell: ({ row }) => <CurrencyCell amount={row.original.total_amount} currency={row.original.currency} />,
  },
  {
    accessorKey: "student_count",
    header: "Students",
    cell: ({ row }) => <span>{row.original.student_count}</span>,
  },
  {
    accessorKey: "issued_date",
    header: "Issued Date",
    cell: ({ row }) => <DateCell date={row.original.issued_date} />,
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => <DateCell date={row.original.due_date} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "paid_at",
    header: "Paid Date",
    cell: ({ row }) => <DateCell date={row.original.paid_at} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell
        actions={[
          { label: "View Invoice", icon: ActionIcons.View, onClick: () => console.log("View", row.original.id) },
          { label: "Download PDF", icon: ActionIcons.View, onClick: () => console.log("Download", row.original.id) },
        ]}
      />
    ),
  },
];

// Subscription columns
export const subscriptionColumns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "tenant_id",
    header: "School",
    cell: ({ row }) => <span>{row.original.tenant_id}</span>,
  },
  {
    accessorKey: "price_per_student_per_term",
    header: "Price/Student/Term",
    cell: ({ row }) => (
      <CurrencyCell amount={row.original.price_per_student_per_term} currency={row.original.currency} />
    ),
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => <DateCell date={row.original.start_date} />,
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => <DateCell date={row.original.end_date} />,
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
            label: "Cancel",
            icon: ActionIcons.Delete,
            onClick: () => console.log("Cancel", row.original.id),
            variant: "danger",
          },
        ]}
      />
    ),
  },
];

// Billing adjustment columns
export const billingAdjustmentColumns: ColumnDef<BillingAdjustment>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <StatusBadge status={row.original.type} />,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <CurrencyCell amount={row.original.amount} currency={row.original.currency} />,
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => <span className="max-w-xs truncate">{row.original.reason}</span>,
  },
  {
    accessorKey: "applied_by",
    header: "Applied By",
    cell: ({ row }) => <span>{row.original.applied_by}</span>,
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => <DateCell date={row.original.created_at} />,
  },
];
