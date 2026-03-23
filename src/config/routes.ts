import type { IconSvgElement } from "@hugeicons/react";
import {
  DashboardSquare03Icon,
  Book02Icon,
  Task01Icon,
  QuizIcon,
  Certificate01Icon,
  ChartLineData01Icon,
  ComputerVideoIcon,
  Notification03Icon,
  Setting07Icon,
  User03Icon,
  UserGroup02Icon,
  Calendar03Icon,
  OfficeIcon,
  ManagerIcon,
  UserAccountIcon,
  Mail01Icon,
  SecurityCheckIcon,
  FileSearchIcon,
  Clock01Icon,
  CheckListIcon,
  MoneyReceiveSquareIcon,
  PresentationBarChart01Icon,
} from "@hugeicons/core-free-icons";

import type { Permission } from "./permissions";
import type { Role } from "@/types";

export interface RouteConfig {
  href: string;
  icon: IconSvgElement;
  name: string;
  permissions: Permission[];
  children?: RouteConfig[];
}

const STUDENT_ROUTES: RouteConfig[] = [
  {
    name: "Dashboard",
    href: "/student",
    icon: DashboardSquare03Icon,
    permissions: [],
  },
  {
    name: "My Class",
    href: "/student/class",
    icon: UserGroup02Icon,
    permissions: [],
  },
  {
    name: "Courses",
    href: "/student/courses",
    icon: Book02Icon,
    permissions: [],
  },
  {
    name: "Timetable",
    href: "/student/timetable",
    icon: Clock01Icon,
    permissions: [],
  },
  {
    name: "Assignments",
    href: "/student/assignments",
    icon: Task01Icon,
    permissions: [],
  },
  {
    name: "Quizzes",
    href: "/student/quizzes",
    icon: QuizIcon,
    permissions: [],
  },
  {
    name: "Examinations",
    href: "/student/examinations",
    icon: Certificate01Icon,
    permissions: [],
  },
  {
    name: "Meetings",
    href: "/student/meetings",
    icon: ComputerVideoIcon,
    permissions: [],
  },
  {
    name: "Progress",
    href: "/student/progress",
    icon: ChartLineData01Icon,
    permissions: [],
  },
  {
    name: "Notifications",
    href: "/student/notifications",
    icon: Notification03Icon,
    permissions: [],
  },
  {
    name: "Settings",
    href: "/student/settings",
    icon: Setting07Icon,
    permissions: [],
  },
  {
    name: "Profile",
    href: "/student/profile",
    icon: User03Icon,
    permissions: [],
  },
];

const TUTOR_ROUTES: RouteConfig[] = [
  {
    name: "Dashboard",
    href: "/tutor",
    icon: DashboardSquare03Icon,
    permissions: [],
  },
  {
    name: "My Classes",
    href: "/tutor/classes",
    icon: UserGroup02Icon,
    permissions: [],
  },
  {
    name: "Courses",
    href: "/tutor/courses",
    icon: Book02Icon,
    permissions: [],
  },
  {
    name: "Timetable",
    href: "/tutor/timetable",
    icon: Clock01Icon,
    permissions: [],
  },
  {
    name: "Assignments",
    href: "/tutor/assignments",
    icon: Task01Icon,
    permissions: [],
  },
  {
    name: "Quizzes",
    href: "/tutor/quizzes",
    icon: QuizIcon,
    permissions: [],
  },
  {
    name: "Examinations",
    href: "/tutor/examinations",
    icon: Certificate01Icon,
    permissions: ["examinations:read"],
  },
  {
    name: "Meetings",
    href: "/tutor/meetings",
    icon: ComputerVideoIcon,
    permissions: ["meetings:read"],
  },
  {
    name: "Attendance",
    href: "/tutor/attendance",
    icon: CheckListIcon,
    permissions: [],
  },
  {
    name: "Students",
    href: "/tutor/students",
    icon: UserAccountIcon,
    permissions: [],
  },
  {
    name: "Progress",
    href: "/tutor/progress",
    icon: ChartLineData01Icon,
    permissions: [],
  },
  {
    name: "Communications",
    href: "/tutor/communications",
    icon: Mail01Icon,
    permissions: ["communications:read"],
  },
  {
    name: "Notifications",
    href: "/tutor/notifications",
    icon: Notification03Icon,
    permissions: [],
  },
  {
    name: "Settings",
    href: "/tutor/settings",
    icon: Setting07Icon,
    permissions: ["sessions:read"],
  },
  {
    name: "Profile",
    href: "/tutor/profile",
    icon: User03Icon,
    permissions: [],
  },
];

const ADMIN_ROUTES: RouteConfig[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: DashboardSquare03Icon,
    permissions: [],
  },
  {
    name: "Sessions",
    href: "/admin/sessions",
    icon: Calendar03Icon,
    permissions: ["sessions:read"],
  },
  {
    name: "Classes",
    href: "/admin/classes",
    icon: UserGroup02Icon,
    permissions: ["classes:read"],
  },
  {
    name: "Timetables",
    href: "/admin/timetables",
    icon: Clock01Icon,
    permissions: [],
  },
  {
    name: "Admins",
    href: "/admin/admins",
    icon: ManagerIcon,
    permissions: [],
  },
  {
    name: "Tutors",
    href: "/admin/tutors",
    icon: UserAccountIcon,
    permissions: [],
  },
  {
    name: "Students",
    href: "/admin/students",
    icon: UserGroup02Icon,
    permissions: [],
  },
  {
    name: "Progress",
    href: "/admin/progress",
    icon: ChartLineData01Icon,
    permissions: [],
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: PresentationBarChart01Icon,
    permissions: ["reports:read"],
  },
  {
    name: "Communications",
    href: "/admin/communications",
    icon: Mail01Icon,
    permissions: ["communications:read"],
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Notification03Icon,
    permissions: [],
  },
  {
    name: "Billing",
    href: "/admin/billing",
    icon: MoneyReceiveSquareIcon,
    permissions: ["billing:read"],
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Setting07Icon,
    permissions: ["sessions:read"],
  },
  {
    name: "Profile",
    href: "/admin/profile",
    icon: User03Icon,
    permissions: [],
  },
];

const SUPER_ADMIN_ROUTES: RouteConfig[] = [
  {
    name: "Dashboard",
    href: "/superadmin",
    icon: DashboardSquare03Icon,
    permissions: [],
  },
  {
    name: "Tenants",
    href: "/superadmin/tenants",
    icon: OfficeIcon,
    permissions: ["tenants:read"],
  },
  {
    name: "Users",
    href: "/superadmin/users",
    icon: UserGroup02Icon,
    permissions: ["users:read"],
  },
  {
    name: "Permissions",
    href: "/superadmin/permissions",
    icon: SecurityCheckIcon,
    permissions: [],
  },
  {
    name: "Billing",
    href: "/superadmin/billing",
    icon: MoneyReceiveSquareIcon,
    permissions: ["billing:read"],
  },
  {
    name: "Audit Logs",
    href: "/superadmin/audit-logs",
    icon: FileSearchIcon,
    permissions: ["audit:read"],
  },
  {
    name: "System Config",
    href: "/superadmin/system-config",
    icon: Setting07Icon,
    permissions: ["settings:read"],
  },
  {
    name: "Profile",
    href: "/superadmin/profile",
    icon: User03Icon,
    permissions: [],
  },
];

export const getRoleRoutes = (role: Role) => {
  switch (role) {
    case "SUPER_ADMIN":
      return SUPER_ADMIN_ROUTES;
    case "ADMIN":
      return ADMIN_ROUTES;
    case "TUTOR":
      return TUTOR_ROUTES;
    case "STUDENT":
      return STUDENT_ROUTES;
    default:
      return [];
  }
};
