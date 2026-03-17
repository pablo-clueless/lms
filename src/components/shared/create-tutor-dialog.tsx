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
import type { CreateUserDto, TutorStatus } from "@/types";
import { useUserStore } from "@/store/core/user";

interface CreateTutorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (tutor: CreateUserDto) => Promise<void>;
  isPending: boolean;
}

interface TutorFormState {
  name: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  headline: string;
  bio: string;
  timezone: string;
  years_of_experience: string;
  specialities: string;
}

const initialTutor: TutorFormState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  gender: "",
  headline: "",
  bio: "",
  timezone: "",
  years_of_experience: "",
  specialities: "",
};

const TIMEZONES = [
  { label: "UTC", value: "UTC" },
  { label: "Africa/Lagos (WAT)", value: "Africa/Lagos" },
  { label: "America/New_York (EST)", value: "America/New_York" },
  { label: "America/Los_Angeles (PST)", value: "America/Los_Angeles" },
  { label: "Europe/London (GMT)", value: "Europe/London" },
  { label: "Asia/Dubai (GST)", value: "Asia/Dubai" },
];

export const CreateTutorDialog = ({ open, onOpenChange, onSubmit, isPending }: CreateTutorDialogProps) => {
  const [tutor, setTutor] = useState(initialTutor);
  const user = useUserStore((state) => state.user);
  const tenantId = user?.tenant_id || "";

  const handleSubmit = async () => {
    const payload: CreateUserDto = {
      name: tutor.name,
      email: tutor.email,
      password: tutor.password,
      role: "TUTOR",
      tenant_id: tenantId,
      profile: {
        phone: tutor.phone || undefined,
        gender: tutor.gender || undefined,
      },
      tutor: {
        headline: tutor.headline || undefined,
        bio: tutor.bio || undefined,
        timezone: tutor.timezone || undefined,
        years_of_experience: tutor.years_of_experience ? parseInt(tutor.years_of_experience, 10) : undefined,
        specialities: tutor.specialities ? tutor.specialities.split(",").map((s) => s.trim()) : undefined,
        status: "ACTIVE" as TutorStatus,
      },
    };
    await onSubmit(payload);
    setTutor(initialTutor);
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setTutor(initialTutor);
    }
    onOpenChange(value);
  };

  const isValid = tutor.name && tutor.email && tutor.password;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Tutor</DialogTitle>
          <DialogDescription>Add a new tutor to the system.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              value={tutor.name}
              onChange={(e) => setTutor({ ...tutor, name: e.target.value })}
              placeholder="John Doe"
              required
            />
            <Input
              label="Email"
              type="email"
              value={tutor.email}
              onChange={(e) => setTutor({ ...tutor, email: e.target.value })}
              placeholder="tutor@example.com"
              required
            />
          </div>
          <Input
            label="Password"
            type="password"
            value={tutor.password}
            onChange={(e) => setTutor({ ...tutor, password: e.target.value })}
            placeholder="Enter password"
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Phone Number"
              value={tutor.phone}
              onChange={(e) => setTutor({ ...tutor, phone: e.target.value })}
              placeholder="+1 234 567 8900"
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Gender</label>
              <Select value={tutor.gender} onValueChange={(value) => setTutor({ ...tutor, gender: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Input
            label="Headline"
            value={tutor.headline}
            onChange={(e) => setTutor({ ...tutor, headline: e.target.value })}
            placeholder="e.g., Senior Software Engineer"
          />
          <Textarea
            label="Bio"
            value={tutor.bio}
            onChange={(e) => setTutor({ ...tutor, bio: e.target.value })}
            placeholder="Brief description about the tutor..."
            className="min-h-20"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Timezone</label>
              <Select value={tutor.timezone} onValueChange={(value) => setTutor({ ...tutor, timezone: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              label="Years of Experience"
              type="number"
              min="0"
              value={tutor.years_of_experience}
              onChange={(e) => setTutor({ ...tutor, years_of_experience: e.target.value })}
              placeholder="5"
            />
          </div>
          <Input
            label="Specialities"
            value={tutor.specialities}
            onChange={(e) => setTutor({ ...tutor, specialities: e.target.value })}
            placeholder="React, Node.js, Python (comma separated)"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !isValid}>
            {isPending ? "Creating..." : "Create Tutor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
