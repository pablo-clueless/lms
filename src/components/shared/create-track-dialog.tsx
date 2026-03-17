"use client";

import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Track, GradeLevel } from "@/types";

interface CreateTrackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (track: Partial<Track>) => Promise<void>;
  isPending: boolean;
}

type CreateTrackDto = Pick<Track, "name" | "code" | "description" | "duration" | "grade_level">;

const initialTrack: CreateTrackDto = {
  name: "",
  code: "",
  description: "",
  duration: 0,
  grade_level: undefined,
};

const GRADE_LEVELS: { label: string; value: GradeLevel }[] = [
  { label: "Primary 1", value: "PRIMARY_1" },
  { label: "Primary 2", value: "PRIMARY_2" },
  { label: "Primary 3", value: "PRIMARY_3" },
  { label: "Primary 4", value: "PRIMARY_4" },
  { label: "Primary 5", value: "PRIMARY_5" },
  { label: "Primary 6", value: "PRIMARY_6" },
  { label: "JSS 1", value: "JSS_1" },
  { label: "JSS 2", value: "JSS_2" },
  { label: "JSS 3", value: "JSS_3" },
  { label: "SSS 1", value: "SSS_1" },
  { label: "SSS 2", value: "SSS_2" },
  { label: "SSS 3", value: "SSS_3" },
];

const generateCode = (name: string) => {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export const CreateTrackDialog = ({ open, onOpenChange, onSubmit, isPending }: CreateTrackDialogProps) => {
  const [track, setTrack] = useState<CreateTrackDto>(initialTrack);

  const handleNameChange = (name: string) => {
    setTrack((prev) => ({
      ...prev,
      name,
      code: generateCode(name),
    }));
  };

  const handleSubmit = async () => {
    await onSubmit(track);
    setTrack(initialTrack);
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setTrack(initialTrack);
    }
    onOpenChange(value);
  };

  const isValid = track.name && track.code && track.duration > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Track</DialogTitle>
          <DialogDescription>Add a new learning track to organize courses and specializations.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="mb-3 text-sm font-medium">Track Information</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Track Name"
                  value={track.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter track name"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Track Code"
                  value={track.code}
                  onChange={(e) => setTrack({ ...track, code: e.target.value })}
                  placeholder="TRACK-CODE"
                  helperText="Unique identifier (auto-generated)"
                  required
                />
              </div>
              <div>
                <Input
                  label="Duration (weeks)"
                  type="number"
                  value={track.duration || ""}
                  onChange={(e) => setTrack({ ...track, duration: parseInt(e.target.value) || 0 })}
                  placeholder="Enter duration"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Grade Level</label>
                <Select
                  value={track.grade_level || ""}
                  onValueChange={(value) => setTrack({ ...track, grade_level: value as GradeLevel })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADE_LEVELS.map((grade) => (
                      <SelectItem key={grade.value} value={grade.value}>
                        {grade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Textarea
                  label="Description"
                  value={track.description}
                  onChange={(e) => setTrack({ ...track, description: e.target.value })}
                  placeholder="Brief description of the track"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !isValid}>
            {isPending ? "Creating..." : "Create Track"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
