import type { IconSvgElement } from "@hugeicons/react";
import {
  DashboardSquare03Icon,
  Book02Icon,
  Task01Icon,
  QuizIcon,
  Certificate01Icon,
  ChartLineData01Icon,
  Notification03Icon,
  Setting07Icon,
  User03Icon,
  UserGroup02Icon,
  Calendar03Icon,
  OfficeIcon,
  ManagerIcon,
  UserAccountIcon,
  Mail01Icon,
  FileEditIcon,
  Folder01Icon,
  SecurityCheckIcon,
  FileSearchIcon,
} from "@hugeicons/core-free-icons";
import type { Role } from "@/types";

export interface RouteConfig {
  href: string;
  icon: IconSvgElement;
  name: string;
  children?: RouteConfig[];
}

const STUDENT_ROUTES: RouteConfig[] = [
  {
    name: "Dashboard",
    href: "/student",
    icon: DashboardSquare03Icon,
  },
  {
    name: "Courses",
    href: "/student/courses",
    icon: Book02Icon,
  },
  {
    name: "Assignments",
    href: "/student/assignments",
    icon: Task01Icon,
  },
  {
    name: "Quizzes",
    href: "/student/quizzes",
    icon: QuizIcon,
  },
  {
    name: "Examinations",
    href: "/student/examinations",
    icon: Certificate01Icon,
  },
  {
    name: "Progress",
    href: "/student/progress",
    icon: ChartLineData01Icon,
  },
  {
    name: "Notifications",
    href: "/student/notifications",
    icon: Notification03Icon,
  },
  {
    name: "Settings",
    href: "/student/settings",
    icon: Setting07Icon,
  },
  {
    name: "Profile",
    href: "/student/profile",
    icon: User03Icon,
  },
];

const TUTOR_ROUTES: RouteConfig[] = [
  {
    name: "Dashboard",
    href: "/tutor",
    icon: DashboardSquare03Icon,
  },
  {
    name: "Tracks",
    href: "/tutor/tracks",
    icon: Folder01Icon,
  },
  {
    name: "Courses",
    href: "/tutor/courses",
    icon: Book02Icon,
  },
  {
    name: "Assignments",
    href: "/tutor/assignments",
    icon: Task01Icon,
  },
  {
    name: "Quizzes",
    href: "/tutor/quizzes",
    icon: QuizIcon,
  },
  {
    name: "Examinations",
    href: "/tutor/examinations",
    icon: Certificate01Icon,
  },
  {
    name: "Sessions",
    href: "/tutor/sessions",
    icon: Calendar03Icon,
  },
  {
    name: "Students",
    href: "/tutor/students",
    icon: UserGroup02Icon,
  },
  {
    name: "Progress",
    href: "/tutor/progress",
    icon: ChartLineData01Icon,
  },
  {
    name: "Notifications",
    href: "/tutor/notifications",
    icon: Notification03Icon,
  },
  {
    name: "Settings",
    href: "/tutor/settings",
    icon: Setting07Icon,
  },
  {
    name: "Profile",
    href: "/tutor/profile",
    icon: User03Icon,
  },
];

const ADMIN_ROUTES: RouteConfig[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: DashboardSquare03Icon,
  },
  {
    name: "Application Forms",
    href: "/admin/application-forms",
    icon: FileEditIcon,
  },
  {
    name: "Applications",
    href: "/admin/applications",
    icon: FileSearchIcon,
  },
  {
    name: "Cohorts",
    href: "/admin/cohorts",
    icon: UserGroup02Icon,
  },
  {
    name: "Sessions",
    href: "/admin/sessions",
    icon: Calendar03Icon,
  },
  {
    name: "Tracks",
    href: "/admin/tracks",
    icon: Folder01Icon,
  },
  {
    name: "Courses",
    href: "/admin/courses",
    icon: Book02Icon,
  },
  {
    name: "Admins",
    href: "/admin/admins",
    icon: ManagerIcon,
  },
  {
    name: "Tutors",
    href: "/admin/tutors",
    icon: UserAccountIcon,
  },
  {
    name: "Students",
    href: "/admin/students",
    icon: UserGroup02Icon,
  },
  {
    name: "Progress",
    href: "/admin/progress",
    icon: ChartLineData01Icon,
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Notification03Icon,
  },
  {
    name: "Communications",
    href: "/admin/communications",
    icon: Mail01Icon,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Setting07Icon,
  },
  {
    name: "Profile",
    href: "/admin/profile",
    icon: User03Icon,
  },
];

const SUPER_ADMIN_ROUTES: RouteConfig[] = [
  {
    name: "Dashboard",
    href: "/superadmin",
    icon: DashboardSquare03Icon,
  },
  {
    name: "Tenants",
    href: "/superadmin/tenants",
    icon: OfficeIcon,
    children: [],
  },
  {
    name: "Users",
    href: "/superadmin/users",
    icon: UserGroup02Icon,
    children: [],
  },
  {
    name: "Permissions",
    href: "/superadmin/permissions",
    icon: SecurityCheckIcon,
    children: [],
  },
  {
    name: "Audit Logs",
    href: "/superadmin/audit-logs",
    icon: FileSearchIcon,
    children: [],
  },
  {
    name: "System Configurations",
    href: "/superadmin/system-configurations",
    icon: Setting07Icon,
    children: [],
  },
  {
    name: "Profile",
    href: "/superadmin/profile",
    icon: User03Icon,
    children: [],
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
