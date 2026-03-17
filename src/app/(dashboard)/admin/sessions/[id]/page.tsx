"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Edit02Icon,
  Calendar03Icon,
  Clock01Icon,
  Video01Icon,
  UserMultipleIcon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";

import { Breadcrumb, Loader, StatusBadge } from "@/components/shared";
import { useGetSession, useUpdateSession } from "@/lib/api/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SessionType, AttendanceStatus } from "@/types";
import { formatDate } from "@/lib";

const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div>
    <p className="text-muted-foreground text-xs">{label}</p>
    <p className="text-foreground text-sm font-medium">{value ?? "—"}</p>
  </div>
);

const InfoItem = ({ icon, label, value }: { icon: typeof Calendar03Icon; label: string; value?: string | number }) => (
  <div className="flex items-center gap-3">
    <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
      <HugeiconsIcon icon={icon} className="text-muted-foreground size-5" />
    </div>
    <Field label={label} value={value} />
  </div>
);

const Page = () => {
  const id = useParams().id as string;
  const router = useRouter();

  const { data: sessionData, isPending } = useGetSession(id);
  const session = sessionData?.data;
  const updateSession = useUpdateSession(id);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    type: "" as SessionType,
    meeting_link: "",
    start_time: "",
    end_time: "",
  });

  const breadcrumbs = [
    { label: "Sessions", href: "/admin/sessions" },
    { label: "Session Details", href: `/admin/sessions/${id}` },
  ];

  const openEdit = () => {
    if (session) {
      setEditForm({
        title: session.title || "",
        description: session.description || "",
        type: session.type,
        meeting_link: session.meeting_link || "",
        start_time: session.start_time?.slice(0, 16) || "",
        end_time: session.end_time?.slice(0, 16) || "",
      });
    }
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    await updateSession.mutateAsync(editForm);
    setEditOpen(false);
  };

  if (isPending) return <Loader />;

  const typeLabels: Record<SessionType, string> = {
    LIVE: "Live Session",
    RECORDED: "Recorded",
    OFFICE_HOURS: "Office Hours",
  };

  const defaultStats: Record<AttendanceStatus, number> = {
    PRESENT: 0,
    ABSENT: 0,
    LATE: 0,
    EXCUSED: 0,
  };

  const attendanceStats = session?.attendance?.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    },
    { ...defaultStats },
  ) || defaultStats;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <Button onClick={() => router.push("/admin/sessions")} size="sm" variant="outline">
        <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" className="size-4" />
        Back to Sessions
      </Button>

      {/* Session Header */}
      <div className="bg-card relative overflow-hidden rounded-xl border">
        <div className="bg-primary/10 h-24" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="border-background bg-primary flex size-24 items-center justify-center rounded-xl border-4 shadow-lg">
                <HugeiconsIcon icon={Video01Icon} className="text-primary-foreground size-12" />
              </div>
              <div className="pb-2">
                <h2 className="text-foreground text-2xl font-semibold">{session?.title}</h2>
                <p className="text-muted-foreground text-sm">{session?.type && typeLabels[session.type]}</p>
                <div className="mt-1">
                  <StatusBadge status={session?.type || "LIVE"} />
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={openEdit}>
              <HugeiconsIcon icon={Edit02Icon} data-icon="inline-start" className="size-4" />
              Edit Session
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      {session?.description && (
        <div className="bg-card rounded-xl border p-6">
          <h3 className="mb-2 text-lg font-semibold">Description</h3>
          <p className="text-muted-foreground text-sm">{session.description}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Session Info */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Session Details</h3>
          <div className="space-y-4">
            <InfoItem icon={Calendar03Icon} label="Start Time" value={formatDate(session?.start_time)} />
            <InfoItem icon={Clock01Icon} label="End Time" value={formatDate(session?.end_time)} />
          </div>
        </div>

        {/* Meeting Link */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Meeting Link</h3>
          {session?.meeting_link ? (
            <a
              href={session.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-2 text-sm"
            >
              <HugeiconsIcon icon={LinkSquare02Icon} className="size-4" />
              Join Meeting
            </a>
          ) : (
            <p className="text-muted-foreground text-sm">No meeting link provided.</p>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Timeline</h3>
          <div className="space-y-4">
            <InfoItem icon={Clock01Icon} label="Created" value={formatDate(session?.created_at)} />
            <InfoItem icon={Clock01Icon} label="Last Updated" value={formatDate(session?.updated_at)} />
          </div>
        </div>
      </div>

      {/* Attendance */}
      <div className="bg-card rounded-xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">Attendance</h3>
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{attendanceStats.PRESENT || 0}</p>
            <p className="text-muted-foreground text-sm">Present</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{attendanceStats.ABSENT || 0}</p>
            <p className="text-muted-foreground text-sm">Absent</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{attendanceStats.LATE || 0}</p>
            <p className="text-muted-foreground text-sm">Late</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{attendanceStats.EXCUSED || 0}</p>
            <p className="text-muted-foreground text-sm">Excused</p>
          </div>
        </div>
        {session?.attendance && session.attendance.length > 0 ? (
          <div className="space-y-2">
            {session.attendance.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-muted flex size-8 items-center justify-center rounded-full">
                    <HugeiconsIcon icon={UserMultipleIcon} className="text-muted-foreground size-4" />
                  </div>
                  <span className="text-sm">{record.student_id}</span>
                </div>
                <div className="flex items-center gap-4">
                  {record.check_in_at && (
                    <span className="text-muted-foreground text-xs">
                      In: {new Date(record.check_in_at).toLocaleTimeString()}
                    </span>
                  )}
                  <StatusBadge status={record.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No attendance records yet.</p>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Session</DialogTitle>
            <DialogDescription>Update session information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={editForm.type}
                onValueChange={(value) => setEditForm({ ...editForm, type: value as SessionType })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LIVE">Live Session</SelectItem>
                  <SelectItem value="RECORDED">Recorded</SelectItem>
                  <SelectItem value="OFFICE_HOURS">Office Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              label="Start Time"
              type="datetime-local"
              value={editForm.start_time}
              onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })}
            />
            <Input
              label="End Time"
              type="datetime-local"
              value={editForm.end_time}
              onChange={(e) => setEditForm({ ...editForm, end_time: e.target.value })}
            />
            <div className="sm:col-span-2">
              <Input
                label="Meeting Link"
                value={editForm.meeting_link}
                onChange={(e) => setEditForm({ ...editForm, meeting_link: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="sm:col-span-2">
              <Textarea
                label="Description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateSession.isPending}>
              {updateSession.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
