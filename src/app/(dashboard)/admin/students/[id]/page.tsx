"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import {
  Mail01Icon,
  Phone,
  RefreshIcon,
  Calendar03Icon,
  UserGroupIcon,
  Add01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Breadcrumb, Loader, TabPanel } from "@/components/shared";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge, DateCell, PercentageCell } from "@/config/columns";
import { useGetStudentEnrollment } from "@/lib/api/enrollment";
import type { GuardianWithDetails } from "@/lib/api/guardian";
import { useGetStudentProgress } from "@/lib/api/progress";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useGetUser } from "@/lib/api/user";
import { Input } from "@/components/ui/input";
import type { Progress } from "@/types";
import { cn } from "@/lib";
import { useCreateGuardian, useGetStudentGuardians, useUnlinkWard } from "@/lib/api/guardian";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const tabs = ["overview", "enrollments", "progress", "guardians"];

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  phone_number: Yup.string().required("Phone number is required"),
  relationship: Yup.string().required("Relationship is required"),
});

const studentProgressColumns: ColumnDef<Progress>[] = [
  {
    accessorKey: "course_id",
    header: "Course",
    cell: ({ row }) => <span className="font-medium">{row.original.course_id.slice(0, 8)}...</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "grade",
    header: "Grade",
    cell: ({ row }) => {
      const grade = row.original.grade;
      if (!grade) return <span className="text-muted-foreground">N/A</span>;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{grade.letter_grade}</span>
          <span className="text-xs text-gray-500">{grade.percentage.toFixed(1)}%</span>
        </div>
      );
    },
  },
  {
    id: "attendance",
    header: "Attendance",
    cell: ({ row }) => <PercentageCell value={row.original.attendance?.percentage || 0} showBar />,
  },
  {
    id: "is_flagged",
    header: "Flagged",
    cell: ({ row }) => (
      <span className={row.original.is_flagged ? "font-medium text-red-600" : "text-muted-foreground"}>
        {row.original.is_flagged ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "class_position",
    header: "Position",
    cell: ({ row }) => <span>{row.original.class_position || "N/A"}</span>,
  },
];

const Page = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [isAddGuardianOpen, setIsAddGuardianOpen] = useState(false);

  const id = useParams().id as string;

  const { data: student, isFetching, isPending, refetch } = useGetUser(id);
  const { data: guardians, isPending: isGuardiansPending } = useGetStudentGuardians(id);
  const { data: enrollment, isPending: isEnrollmentPending } = useGetStudentEnrollment(id);
  const { data: progressData, isPending: isProgressPending } = useGetStudentProgress(id);

  const createGuardian = useCreateGuardian();
  const unlinkWard = useUnlinkWard();

  const formik = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      relationship: "",
      is_primary: false,
      notes: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      createGuardian.mutate(
        {
          ...values,
          student_id: id,
        },
        {
          onSuccess: () => {
            setIsAddGuardianOpen(false);
            resetForm();
          },
        },
      );
    },
  });

  const breadcrumbs = [
    { label: "Students", href: "/admin/students" },
    { label: student?.first_name || "Student Details", href: `/admin/students/${id}` },
  ];

  if (isPending) return <Loader />;

  const initials = `${student?.first_name?.[0] || ""}${student?.last_name?.[0] || ""}`.toUpperCase();

  const handleRemoveGuardian = (guardianshipId: string) => {
    if (confirm("Are you sure you want to remove this guardian?")) {
      unlinkWard.mutate(guardianshipId);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsAddGuardianOpen(open);
    if (!open) {
      formik.resetForm();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={student?.profile_photo} alt={student?.first_name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-foreground text-2xl font-semibold">
              {student?.first_name} {student?.last_name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Mail01Icon} className="size-4" />
                {student?.email}
              </span>
              {student?.phone && (
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={Phone} className="size-4" />
                  {student?.phone}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <StatusBadge status={student?.status || "INACTIVE"} />
          <Button disabled={isFetching} onClick={() => refetch()} variant="outline" size="sm">
            <HugeiconsIcon
              icon={RefreshIcon}
              data-icon="inline-start"
              className={cn("size-4", isFetching && "animate-spin")}
            />
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>
      <div className="w-full space-y-4">
        <div className="border-b">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium capitalize transition-colors",
                  currentTab === tab
                    ? "border-primary text-primary border-b-2"
                    : "text-muted-foreground hover:text-foreground",
                )}
                key={tab}
                onClick={() => setCurrentTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <TabPanel selected={currentTab} value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Personal Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Full Name</span>
                  <span>
                    {student?.first_name} {student?.middle_name} {student?.last_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{student?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{student?.phone || "Not provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={student?.status || "INACTIVE"} />
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Account Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <span className="capitalize">{student?.role?.toLowerCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login</span>
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Calendar03Icon} className="size-3" />
                    {student?.last_login_at ? new Date(student.last_login_at).toLocaleDateString() : "Never"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{student?.created_at ? new Date(student.created_at).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
              <h4 className="font-semibold">Academic Summary</h4>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <p className="text-primary text-2xl font-bold">{enrollment ? 1 : 0}</p>
                  <p className="text-muted-foreground text-sm">Enrolled Classes</p>
                </div>
                <div className="text-center">
                  <p className="text-primary text-2xl font-bold">{progressData?.data?.length || 0}</p>
                  <p className="text-muted-foreground text-sm">Active Courses</p>
                </div>
                <div className="text-center">
                  <p className="text-primary text-2xl font-bold">
                    {progressData?.data?.filter((p) => p.status === "COMPLETED").length || 0}
                  </p>
                  <p className="text-muted-foreground text-sm">Completed Courses</p>
                </div>
                <div className="text-center">
                  <p className="text-primary text-2xl font-bold">
                    {progressData?.data?.length
                      ? Math.round(
                          progressData.data.reduce((acc, p) => acc + (p.attendance?.percentage || 0), 0) /
                            progressData.data.length,
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-muted-foreground text-sm">Avg Attendance</p>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel selected={currentTab} value="enrollments">
          {isEnrollmentPending ? (
            <Loader />
          ) : enrollment ? (
            <div className="space-y-6">
              <div className="rounded-lg border p-6">
                <h4 className="mb-4 font-semibold">Current Enrollment</h4>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Class</span>
                      <span className="font-medium">{enrollment.class?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Session</span>
                      <span>{enrollment.session?.label || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <StatusBadge status={enrollment.enrollment?.status || "ACTIVE"} />
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Enrollment Date</span>
                      <DateCell date={enrollment.enrollment?.enrollment_date} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level</span>
                      <span>{enrollment.class?.level || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity</span>
                      <span>{enrollment.class?.capacity || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid min-h-[300px] place-items-center rounded-lg border border-dashed">
              <div className="flex flex-col items-center gap-y-4 text-center">
                <p className="text-muted-foreground">This student is not enrolled in any class</p>
                <Button size="sm">Enroll Student</Button>
              </div>
            </div>
          )}
        </TabPanel>

        <TabPanel selected={currentTab} value="progress">
          {isProgressPending ? (
            <Loader />
          ) : progressData?.data?.length ? (
            <div className="space-y-4">
              <DataTable columns={studentProgressColumns} data={progressData.data} />
            </div>
          ) : (
            <div className="grid min-h-[300px] place-items-center rounded-lg border border-dashed">
              <div className="flex flex-col items-center gap-y-4 text-center">
                <p className="text-muted-foreground">No progress records found for this student</p>
              </div>
            </div>
          )}
        </TabPanel>

        <TabPanel selected={currentTab} value="guardians">
          {isGuardiansPending ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Guardians ({guardians?.data?.length || 0})</h4>
                <Dialog open={isAddGuardianOpen} onOpenChange={handleDialogClose}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <HugeiconsIcon icon={Add01Icon} className="size-4" data-icon="inline-start" />
                      Add Guardian
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add Guardian</DialogTitle>
                      <DialogDescription>
                        Create a new parent or guardian account and link them to this student.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                          label="First Name"
                          name="first_name"
                          value={formik.values.first_name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.first_name ? formik.errors.first_name : undefined}
                          required
                        />
                        <Input
                          label="Last Name"
                          name="last_name"
                          value={formik.values.last_name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.last_name ? formik.errors.last_name : undefined}
                          required
                        />
                      </div>
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email ? formik.errors.email : undefined}
                        required
                      />
                      <Input
                        label="Phone Number"
                        name="phone_number"
                        type="tel"
                        value={formik.values.phone_number}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.phone_number ? formik.errors.phone_number : undefined}
                        required
                      />
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">
                          Relationship <span className="text-destructive">*</span>
                        </label>
                        <Select
                          value={formik.values.relationship}
                          onValueChange={(v) => formik.setFieldValue("relationship", v)}
                        >
                          <SelectTrigger
                            className={
                              formik.touched.relationship && formik.errors.relationship ? "border-destructive" : ""
                            }
                          >
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FATHER">Father</SelectItem>
                            <SelectItem value="MOTHER">Mother</SelectItem>
                            <SelectItem value="GUARDIAN">Guardian</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {formik.touched.relationship && formik.errors.relationship && (
                          <p className="text-destructive text-sm">{formik.errors.relationship}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="is_primary"
                          checked={formik.values.is_primary}
                          onCheckedChange={(checked) => formik.setFieldValue("is_primary", checked === true)}
                        />
                        <label htmlFor="is_primary" className="text-sm font-normal">
                          Primary Contact
                        </label>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Notes (Optional)</label>
                        <Textarea
                          name="notes"
                          value={formik.values.notes}
                          onChange={formik.handleChange}
                          placeholder="Any additional notes..."
                          rows={3}
                        />
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createGuardian.isPending}>
                          {createGuardian.isPending ? "Creating..." : "Create Guardian"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {guardians?.data?.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {guardians.data.map((guardian: GuardianWithDetails) => (
                    <div key={guardian.id} className="relative rounded-lg border p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={guardian.guardian_user?.profile_photo} />
                          <AvatarFallback>
                            <HugeiconsIcon icon={UserGroupIcon} className="size-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium">
                              {guardian.guardian_user?.first_name} {guardian.guardian_user?.last_name}
                            </h5>
                            {guardian.is_primary && (
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                                Primary
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm">{guardian.guardian_user?.email}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600 capitalize">{guardian.relationship?.toLowerCase()}</span>
                            <StatusBadge status={guardian.status} />
                          </div>
                          {guardian.notes && <p className="text-muted-foreground mt-2 text-xs">{guardian.notes}</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleRemoveGuardian(guardian.id)}
                          disabled={unlinkWard.isPending}
                        >
                          <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid min-h-[300px] place-items-center rounded-lg border border-dashed">
                  <div className="flex flex-col items-center gap-y-4 text-center">
                    <HugeiconsIcon icon={UserGroupIcon} className="text-muted-foreground size-12" />
                    <p className="text-muted-foreground">No guardians linked to this student</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabPanel>
      </div>
    </div>
  );
};

export default Page;
