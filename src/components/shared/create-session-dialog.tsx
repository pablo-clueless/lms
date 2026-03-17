"use client";

import { useState } from "react";
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
import type { Session, SessionType, Course, User, Cohort } from "@/types";

interface CreateSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (session: Partial<Session>) => Promise<void>;
  isPending: boolean;
  courses: Course[];
  tutors: User[];
  cohorts: Cohort[];
}

interface SessionFormData {
  title: string;
  description: string;
  course_id: string;
  cohort_id: string;
  tutor_id: string;
  type: SessionType;
  start_time: string;
  end_time: string;
  meeting_link: string;
}

const initialSession: SessionFormData = {
  title: "",
  description: "",
  course_id: "",
  cohort_id: "",
  tutor_id: "",
  type: "LIVE",
  start_time: "",
  end_time: "",
  meeting_link: "",
};

const SESSION_TYPES: { label: string; value: SessionType }[] = [
  { label: "Live", value: "LIVE" },
  { label: "Recorded", value: "RECORDED" },
  { label: "Office Hours", value: "OFFICE_HOURS" },
];

export const CreateSessionDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  courses,
  tutors,
  cohorts,
}: CreateSessionDialogProps) => {
  const [session, setSession] = useState(initialSession);

  const handleSubmit = async () => {
    await onSubmit({
      title: session.title,
      description: session.description,
      course_id: session.course_id,
      cohort_id: session.cohort_id,
      tutor_id: session.tutor_id,
      type: session.type,
      start_time: session.start_time,
      end_time: session.end_time,
      meeting_link: session.meeting_link || undefined,
    });
    setSession(initialSession);
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setSession(initialSession);
    }
    onOpenChange(value);
  };

  const isValid =
    session.title &&
    session.course_id &&
    session.cohort_id &&
    session.tutor_id &&
    session.start_time &&
    session.end_time;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Session</DialogTitle>
          <DialogDescription>Schedule a new learning session for students.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="mb-3 text-sm font-medium">Session Information</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Session Title"
                  value={session.title}
                  onChange={(e) => setSession({ ...session, title: e.target.value })}
                  placeholder="Enter session title"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Textarea
                  label="Description"
                  value={session.description}
                  onChange={(e) => setSession({ ...session, description: e.target.value })}
                  placeholder="Brief description of the session"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Type</label>
                <Select
                  value={session.type}
                  onValueChange={(value: SessionType) => setSession({ ...session, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SESSION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <Select
                  value={session.course_id}
                  onValueChange={(value) => setSession({ ...session, course_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cohort</label>
                <Select
                  value={session.cohort_id}
                  onValueChange={(value) => setSession({ ...session, cohort_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cohort" />
                  </SelectTrigger>
                  <SelectContent>
                    {cohorts.map((cohort) => (
                      <SelectItem key={cohort.id} value={cohort.id}>
                        {cohort.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tutor</label>
                <Select value={session.tutor_id} onValueChange={(value) => setSession({ ...session, tutor_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tutor" />
                  </SelectTrigger>
                  <SelectContent>
                    {tutors.map((tutor) => (
                      <SelectItem key={tutor.id} value={tutor.id}>
                        {tutor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="mb-3 text-sm font-medium">Schedule</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Start Time"
                type="datetime-local"
                value={session.start_time}
                onChange={(e) => setSession({ ...session, start_time: e.target.value })}
                required
              />
              <Input
                label="End Time"
                type="datetime-local"
                value={session.end_time}
                onChange={(e) => setSession({ ...session, end_time: e.target.value })}
                required
              />
              <div className="sm:col-span-2">
                <Input
                  label="Meeting Link"
                  value={session.meeting_link}
                  onChange={(e) => setSession({ ...session, meeting_link: e.target.value })}
                  placeholder="https://zoom.us/j/123456789"
                  helperText="Optional: Add a link for virtual sessions"
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
            {isPending ? "Creating..." : "Create Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
