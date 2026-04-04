import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge, DateCell, UserAvatarCell, ActionCell, ActionIcons } from "./shared";
import type { GuardianWithDetails } from "@/lib/api/guardian";
import type { Role, User } from "@/types";
import { getBasePathByRole } from "@/lib";

export const userColumns: ColumnDef<User>[] = [
  {
    id: "user",
    header: "User",
    cell: ({ row }) => (
      <UserAvatarCell
        name={`${row.original.first_name} ${row.original.last_name}`}
        email={row.original.email}
        avatar={row.original.profile_photo}
      />
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span>{row.original.phone || "N/A"}</span>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <StatusBadge status={row.original.role} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "last_login_at",
    header: "Last Login",
    cell: ({ row }) => <DateCell date={row.original.last_login_at} formatStr="dd/MM/yyyy HH:mm" />,
  },
  {
    accessorKey: "created_at",
    header: "Date Joined",
    cell: ({ row }) => <DateCell date={row.original.created_at} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ActionCell
          actions={[
            {
              label: "View",
              icon: ActionIcons.View,
              href: `${getBasePathByRole(row.original.role)}/users/${row.original.id}`,
            },
            {
              label: "Edit",
              icon: ActionIcons.Edit,
              href: `${getBasePathByRole(row.original.role)}/users/${row.original.id}/edit`,
            },
            {
              label: "Delete",
              icon: ActionIcons.Delete,
              onClick: () => console.log("Delete", row.original.id),
              variant: "danger",
            },
          ]}
        />
      );
    },
  },
];

export const adminColumns: ColumnDef<User>[] = [
  {
    id: "user",
    header: "Admin",
    cell: ({ row }) => (
      <UserAvatarCell
        name={`${row.original.first_name} ${row.original.last_name}`}
        email={row.original.email}
        avatar={row.original.profile_photo}
      />
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span>{row.original.phone || "N/A"}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "last_login_at",
    header: "Last Login",
    cell: ({ row }) => <DateCell date={row.original.last_login_at} formatStr="dd/MM/yyyy HH:mm" />,
  },
  {
    accessorKey: "created_at",
    header: "Date Joined",
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
            label: "Deactivate",
            icon: ActionIcons.Delete,
            onClick: () => console.log("Deactivate", row.original.id),
            variant: "danger",
          },
        ]}
      />
    ),
  },
];

export const tutorColumns: ColumnDef<User>[] = [
  {
    id: "user",
    header: "Tutor",
    cell: ({ row }) => (
      <UserAvatarCell
        name={`${row.original.first_name} ${row.original.last_name}`}
        email={row.original.email}
        avatar={row.original.profile_photo}
      />
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span>{row.original.phone || "N/A"}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "last_login_at",
    header: "Last Login",
    cell: ({ row }) => <DateCell date={row.original.last_login_at} formatStr="dd/MM/yyyy HH:mm" />,
  },
  {
    accessorKey: "created_at",
    header: "Date Joined",
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
            label: "Deactivate",
            icon: ActionIcons.Delete,
            onClick: () => console.log("Deactivate", row.original.id),
            variant: "danger",
          },
        ]}
      />
    ),
  },
];

export const studentColumns = (role: Role): ColumnDef<User>[] => [
  {
    id: "user",
    header: "Student",
    cell: ({ row }) => (
      <UserAvatarCell
        name={`${row.original.first_name} ${row.original.last_name}`}
        email={row.original.email}
        avatar={row.original.profile_photo}
      />
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span>{row.original.phone || "N/A"}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "last_login_at",
    header: "Last Login",
    cell: ({ row }) => <DateCell date={row.original.last_login_at} formatStr="dd/MM/yyyy HH:mm" />,
  },
  {
    accessorKey: "created_at",
    header: "Date Enrolled",
    cell: ({ row }) => <DateCell date={row.original.created_at} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell
        actions={[
          {
            label: "View Profile",
            icon: ActionIcons.View,
            href: `${getBasePathByRole(role)}/students/${row.original.id}`,
          },
          { label: "Edit", icon: ActionIcons.Edit, onClick: () => console.log("Edit", row.original.id) },
          {
            label: "Suspend",
            icon: ActionIcons.Delete,
            onClick: () => console.log("Suspend", row.original.id),
            variant: "danger",
          },
        ]}
      />
    ),
  },
];

export const wardColumns: ColumnDef<GuardianWithDetails>[] = [
  {
    id: "student",
    header: "Student",
    cell: ({ row }) => {
      const student = row.original.student_user;
      if (!student) return <span className="text-muted-foreground">N/A</span>;
      return (
        <UserAvatarCell
          name={`${student.first_name} ${student.last_name}`}
          email={student.email}
          avatar={student.profile_photo}
        />
      );
    },
  },
  {
    accessorKey: "relationship",
    header: "Relationship",
    cell: ({ row }) => <StatusBadge status={row.original.relationship} />,
  },
  {
    accessorKey: "is_primary",
    header: "Primary",
    cell: ({ row }) => (
      <span className={row.original.is_primary ? "font-medium text-green-600" : "text-muted-foreground"}>
        {row.original.is_primary ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "created_at",
    header: "Date Added",
    cell: ({ row }) => <DateCell date={row.original.created_at} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell
        actions={[
          {
            label: "View Profile",
            icon: ActionIcons.View,
            href: `/parent/wards/${row.original.student_id}`,
          },
          {
            label: "View Progress",
            icon: ActionIcons.View,
            href: `/parent/wards/${row.original.student_id}/progress`,
          },
          {
            label: "View Invoices",
            icon: ActionIcons.View,
            href: `/parent/wards/${row.original.student_id}/invoices`,
          },
        ]}
      />
    ),
  },
];
