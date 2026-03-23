"use client";

import { useMemo, useState } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGenerateTimetable } from "@/lib/api/timetable";
import { useGetSessions } from "@/lib/api/session";
import type { CreateTimeTableDto } from "@/types";
import { useGetClasses } from "@/lib/api/class";
import { useGetTerms } from "@/lib/api/term";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";

const schema = Yup.object({
  class_id: Yup.string().required("Class is required"),
  session_id: Yup.string().required("Session is required"),
  term_id: Yup.string().required("Term is required"),
  config: Yup.object({
    periods_per_day: Yup.number()
      .required("Periods per day is required")
      .min(1, "Must have at least 1 period")
      .max(12, "Cannot exceed 12 periods"),
    period_duration_minutes: Yup.number()
      .required("Period duration is required")
      .min(15, "Period must be at least 15 minutes")
      .max(120, "Period cannot exceed 120 minutes"),
    break_duration_minutes: Yup.number()
      .required("Break duration is required")
      .min(5, "Break must be at least 5 minutes")
      .max(60, "Break cannot exceed 60 minutes"),
    start_time: Yup.string().required("Start time is required"),
    days: Yup.array().of(Yup.string()).min(1, "At least one day is required"),
  }),
});

const initialValues: CreateTimeTableDto = {
  class_id: "",
  session_id: "",
  term_id: "",
  config: {
    periods_per_day: 6,
    period_duration_minutes: 45,
    break_duration_minutes: 15,
    start_time: "08:00",
    days: [],
  },
};

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const CreateTimeTable = () => {
  const [open, setOpen] = useState(false);
  const { mutate: generateTimetable, isPending } = useGenerateTimetable();

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      generateTimetable(values, {
        onSuccess: () => {
          toast.success("Timetable generated successfully");
          setOpen(false);
          formik.resetForm();
        },
        onError: () => {
          toast.error("Failed to generate timetable");
        },
      });
    },
  });

  const { data: sessionsData } = useGetSessions({ limit: 50, page: 1 });
  const { data: classesData } = useGetClasses({ limit: 50, page: 1 });
  const { data: termsData } = useGetTerms(formik.values.session_id);

  const handleDayChange = (day: string, checked: boolean) => {
    const currentDays = formik.values.config.days;
    if (checked) {
      formik.setFieldValue("config.days", [...currentDays, day]);
    } else {
      formik.setFieldValue(
        "config.days",
        currentDays.filter((d) => d !== day),
      );
    }
  };

  const classes = useMemo(() => {
    if (!classesData) return [];
    return classesData.classes.sort((a, b) => a.name.localeCompare(b.name));
  }, [classesData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Timetable</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Generate Timetable</DialogTitle>
          <DialogDescription>
            Configure and generate a new timetable for a class. The system will automatically schedule periods based on
            course requirements.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Session <span className="text-destructive">*</span>
              </label>
              <Select
                value={formik.values.session_id}
                onValueChange={(value) => {
                  formik.setFieldValue("session_id", value);
                  formik.setFieldValue("term_id", "");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  {sessionsData?.sessions?.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.session_id && formik.errors.session_id && (
                <p className="text-destructive text-sm">{formik.errors.session_id}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Term <span className="text-destructive">*</span>
              </label>
              <Select
                value={formik.values.term_id}
                onValueChange={(value) => formik.setFieldValue("term_id", value)}
                disabled={!formik.values.session_id}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  {termsData?.terms?.map((term) => (
                    <SelectItem key={term.id} value={term.id}>
                      {term.ordinal.charAt(0) + term.ordinal.slice(1).toLowerCase()} Term
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.term_id && formik.errors.term_id && (
                <p className="text-destructive text-sm">{formik.errors.term_id}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Class <span className="text-destructive">*</span>
              </label>
              <Select
                value={formik.values.class_id}
                onValueChange={(value) => formik.setFieldValue("class_id", value)}
                disabled={!formik.values.term_id}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.class_id && formik.errors.class_id && (
                <p className="text-destructive text-sm">{formik.errors.class_id}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              School Days <span className="text-destructive">*</span>
            </label>
            <div className="flex flex-wrap gap-4">
              {weekDays.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day}`}
                    checked={formik.values.config.days.includes(day)}
                    onCheckedChange={(checked) => handleDayChange(day, checked as boolean)}
                  />
                  <label htmlFor={`day-${day}`} className="text-sm font-medium">
                    {day}
                  </label>
                </div>
              ))}
            </div>
            {formik.touched.config?.days && formik.errors.config?.days && (
              <p className="text-destructive text-sm">{formik.errors.config.days as string}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Start Time"
              name="config.start_time"
              type="time"
              value={formik.values.config.start_time}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.config?.start_time ? formik.errors.config?.start_time : undefined}
              required
            />
            <Input
              label="Periods Per Day"
              name="config.periods_per_day"
              type="number"
              min={1}
              max={12}
              value={formik.values.config.periods_per_day}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.config?.periods_per_day ? formik.errors.config?.periods_per_day : undefined}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Period Duration (minutes)"
              name="config.period_duration_minutes"
              type="number"
              min={15}
              max={120}
              value={formik.values.config.period_duration_minutes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.config?.period_duration_minutes
                  ? formik.errors.config?.period_duration_minutes
                  : undefined
              }
              required
            />
            <Input
              label="Break Duration (minutes)"
              name="config.break_duration_minutes"
              type="number"
              min={5}
              max={60}
              value={formik.values.config.break_duration_minutes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.config?.break_duration_minutes ? formik.errors.config?.break_duration_minutes : undefined
              }
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Generating..." : "Generate Timetable"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
