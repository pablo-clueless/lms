"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Edit02Icon,
  Calendar03Icon,
  Clock01Icon,
  Book02Icon,
  Route01Icon,
} from "@hugeicons/core-free-icons";

import { Breadcrumb, Loader, StatusBadge } from "@/components/shared";
import { useGetTrack, useUpdateTrack } from "@/lib/api/cohort";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib";

const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div>
    <p className="text-muted-foreground text-xs">{label}</p>
    <p className="text-foreground text-sm font-medium">{value ?? "—"}</p>
  </div>
);

const Page = () => {
  const id = useParams().id as string;
  const router = useRouter();

  const { data: trackData, isPending } = useGetTrack(id);
  const track = trackData?.data;
  const updateTrack = useUpdateTrack(id);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    code: "",
    description: "",
    duration: 0,
  });

  const breadcrumbs = [
    { label: "Tracks", href: "/admin/tracks" },
    { label: "Track Details", href: `/admin/tracks/${id}` },
  ];

  const openEdit = () => {
    if (track) {
      setEditForm({
        name: track.name || "",
        code: track.code || "",
        description: track.description || "",
        duration: track.duration || 0,
      });
    }
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    await updateTrack.mutateAsync(editForm);
    setEditOpen(false);
  };

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <Button onClick={() => router.push("/admin/tracks")} size="sm" variant="outline">
        <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" className="size-4" />
        Back to Tracks
      </Button>

      {/* Track Header */}
      <div className="bg-card relative overflow-hidden rounded-xl border">
        <div className="bg-primary/10 h-24" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="border-background bg-primary flex size-24 items-center justify-center rounded-xl border-4 shadow-lg">
                <HugeiconsIcon icon={Route01Icon} className="text-primary-foreground size-12" />
              </div>
              <div className="pb-2">
                <h2 className="text-foreground text-2xl font-semibold">{track?.name}</h2>
                <p className="text-muted-foreground font-mono text-sm">{track?.code}</p>
                {track?.grade_level && (
                  <div className="mt-1">
                    <StatusBadge status={track.grade_level} />
                  </div>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={openEdit}>
              <HugeiconsIcon icon={Edit02Icon} data-icon="inline-start" className="size-4" />
              Edit Track
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      {track?.description && (
        <div className="bg-card rounded-xl border p-6">
          <h3 className="mb-2 text-lg font-semibold">Description</h3>
          <p className="text-muted-foreground text-sm">{track.description}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Track Info */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Track Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={Clock01Icon} className="text-muted-foreground size-5" />
              </div>
              <Field label="Duration" value={`${track?.duration || 0} weeks`} />
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={Book02Icon} className="text-muted-foreground size-5" />
              </div>
              <Field label="Cohorts" value={track?.cohorts?.length || 0} />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Timeline</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={Calendar03Icon} className="text-muted-foreground size-5" />
              </div>
              <Field label="Created" value={formatDate(track?.created_at)} />
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={Calendar03Icon} className="text-muted-foreground size-5" />
              </div>
              <Field label="Last Updated" value={formatDate(track?.updated_at)} />
            </div>
          </div>
        </div>
      </div>

      {/* Cohorts */}
      <div className="bg-card rounded-xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">Associated Cohorts</h3>
        {track?.cohorts && track.cohorts.length > 0 ? (
          <div className="space-y-3">
            {track.cohorts.map((cohort) => (
              <div
                key={cohort.id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div>
                  <p className="font-medium">{cohort.name}</p>
                  <p className="text-muted-foreground text-sm">Max {cohort.max_students} students</p>
                </div>
                <StatusBadge status={cohort.status} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No cohorts associated with this track.</p>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Track</DialogTitle>
            <DialogDescription>Update track information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <Input
              label="Code"
              value={editForm.code}
              onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
            />
            <Input
              label="Duration (weeks)"
              type="number"
              value={editForm.duration}
              onChange={(e) => setEditForm({ ...editForm, duration: parseInt(e.target.value) || 0 })}
            />
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
            <Button onClick={handleUpdate} disabled={updateTrack.isPending}>
              {updateTrack.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
