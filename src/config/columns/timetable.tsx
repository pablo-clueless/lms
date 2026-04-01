"use client";

import { Archive01Icon, Upload05Icon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";

import { StatusBadge, DateCell, DateTimeCell, ActionCell, ActionIcons } from "./shared";
import { usePublishTimetable, useArchiveTimetable } from "@/lib/api/timetable";
import type { Role, Timetable } from "@/types";
import { getBasePathByRole } from "@/lib";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TimetableActions = ({ timetable, role }: { timetable: Timetable; role: Role }) => {
  const [publishOpen, setPublishOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);

  const { mutate: publish, isPending: isPublishing } = usePublishTimetable();
  const { mutate: archive, isPending: isArchiving } = useArchiveTimetable();

  const handlePublish = () => {
    publish(timetable.id, {
      onSuccess: () => {
        toast.success("Timetable published successfully");
        setPublishOpen(false);
      },
      onError: () => toast.error("Failed to publish timetable"),
    });
  };

  const handleArchive = () => {
    archive(timetable.id, {
      onSuccess: () => {
        toast.success("Timetable archived successfully");
        setArchiveOpen(false);
      },
      onError: () => toast.error("Failed to archive timetable"),
    });
  };

  return (
    <>
      <ActionCell
        actions={[
          {
            label: "View Timetable",
            icon: ActionIcons.View,
            href: `${getBasePathByRole(role)}/timetables/${timetable.id}`,
          },
          {
            label: "Publish",
            icon: Upload05Icon,
            onClick: () => setPublishOpen(true),
            hidden: timetable.status !== "DRAFT",
          },
          {
            label: "Edit",
            icon: ActionIcons.Edit,
            href: `${getBasePathByRole(role)}/timetables/${timetable.id}/edit`,
            hidden: timetable.status !== "DRAFT",
          },
          {
            label: "Archive",
            icon: Archive01Icon,
            onClick: () => setArchiveOpen(true),
            variant: "danger",
            hidden: timetable.status !== "PUBLISHED",
          },
        ]}
      />

      {/* Publish Dialog */}
      <AlertDialog open={publishOpen} onOpenChange={setPublishOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Timetable</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish this timetable for <strong>{timetable.class.name}</strong>? Once
              published, students and tutors will be able to view it. This action will notify all affected users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPublishing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? "Publishing..." : "Publish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive Dialog */}
      <AlertDialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Timetable</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive the timetable for <strong>{timetable.class.name}</strong>? The timetable
              will no longer be visible to students and tutors. You can generate a new timetable after archiving.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isArchiving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              disabled={isArchiving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isArchiving ? "Archiving..." : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const timetableColumns = (role: Role): ColumnDef<Timetable>[] => [
  {
    accessorKey: "class.name",
    header: "Class",
    cell: ({ row }) => <span>{row.original.class.name}</span>,
  },
  {
    accessorKey: "term.ordinal",
    header: "Term",
    cell: ({ row }) => <span>{row.original.term.ordinal}</span>,
  },
  {
    accessorKey: "generation_version",
    header: "Version",
    cell: ({ row }) => <span className="font-mono">v{row.original.generation_version}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "generated_at",
    header: "Generated At",
    cell: ({ row }) => <DateTimeCell date={row.original.generated_at} />,
  },
  {
    accessorKey: "published_at",
    header: "Published At",
    cell: ({ row }) => <DateTimeCell date={row.original.published_at} />,
  },
  {
    accessorKey: "created_at",
    header: "Date Created",
    cell: ({ row }) => <DateCell date={row.original.created_at} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <TimetableActions timetable={row.original} role={role} />,
  },
];
