export interface SuperAdminDashboardResponse {
  role: "SUPER_ADMIN";
  stats: {
    unread_notifications: number;
    total_tenants: number;
  };
  recent_activities: [];
  upcoming_events: [];
  quick_actions: QuickActions[];
}

export interface QuickActions {
  label: string;
  action: string;
  icon: string;
}

export interface AdminDashboardResponse {
  role: "ADMIN";
}

export interface TutorDashboardResponse {
  role: "TUTOR";
}

export interface StudentDashboardResponse {
  role: "STUDENT";
}
