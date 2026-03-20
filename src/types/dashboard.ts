import type { Session } from "./session";
import type { Tenant } from "./tenant";

export interface SuperAdminDashboardResponse {
  role: "SUPER_ADMIN";
  dashboard: {
    total_tenants: number;
    active_tenants: number;
    suspended_tenants: number;
    total_users: number;
    users_by_role: {
      ADMIN: number;
      STUDENT: number;
      SUPER_ADMIN: number;
      TUTOR: number;
    };
    recent_tenants: Tenant[];
    user_growth: {
      count: number;
      date: string;
    }[];
    system_metrics: {
      uptime_seconds: number;
      uptime_formatted: string;
      total_requests: number;
      error_count: number;
      error_rate: number;
      avg_latency_ms: number;
      active_connections: number;
    };
    db_stats: {
      max_open_connections: number;
      open_connections: number;
      in_use: number;
      idle: number;
      wait_count: number;
      wait_duration_ms: number;
    };
    billing_metrics: {
      total_revenue: number;
      mrr: number;
      upcoming_payments: number;
      late_payments: number;
      upcoming_count: number;
      late_count: number;
      recent_invoices: [];
    };
  };
}

export interface QuickActions {
  label: string;
  action: string;
  icon: string;
}

export interface AdminDashboardResponse {
  role: "ADMIN";
  dashboard: {
    tenant_info: Tenant;
    total_users: number;
    users_by_role: {
      ADMIN: number;
      STUDENT: number;
      TUTOR: number;
    };
    total_classes: number;
    total_courses: number;
    total_sessions: number;
    active_session: Session;
    total_enrollments: number;
    active_enrollments: number;
  };
}

export interface TutorDashboardResponse {
  active_students: number;
  grading_queue: {
    pending_assignments: number;
    pending_quizzes: number;
    pending_exams: number;
    total: number;
    oldest_pending_days: number;
  };
  at_risk_students: {
    student_id: string;
    student_name: string;
    last_active_date: string;
    days_inactive: number;
    course_progress: number;
    course_name: string;
  }[];
  score_distribution: {
    average_score: number;
    highest_score: number;
    lowest_score: number;
    pass_rate: number;
    grade_distribution: {
      additionalProp1: number;
      additionalProp2: number;
      additionalProp3: number;
    };
  };
  discussion_activity: {
    new_posts: number;
    pending_responses: number;
    unread_messages: number;
  };
  course_ratings: {
    course_id: string;
    course_name: string;
    average_rating: number;
    total_reviews: number;
    recent_trend: "up" | "down";
  }[];
  upcoming_events: {
    type: string;
    title: string;
    due_date: string;
    course_name: string;
    link: string;
  }[];
  my_courses: {
    course_id: string;
    course_name: string;
    student_count: number;
    completion_rate: number;
    pending_grading: number;
  }[];
}

export interface StudentDashboardResponse {
  course_progress: {
    course_id: string;
    course_name: string;
    progress: number;
    completed_modules: number;
    total_modules: number;
    last_accessed_at: string;
    status: string;
  }[];
  upcoming_deadlines: {
    type: string;
    title: string;
    course_name: string;
    due_date: string;
    days_left: number;
    priority: string;
    link: string;
  }[];
  learning_stats: {
    total_hours: number;
    this_week_hours: number;
    last_week_hours: number;
    avg_daily_minutes: number;
    longest_streak_days: number;
    current_streak_days: number;
  };
  recent_grades: {
    type: string;
    title: string;
    course_name: string;
    score: number;
    max_score: number;
    grade: string;
    graded_at: string;
    feedback: string;
  }[];
  certificates: {
    total: number;
    recent: {
      certificate_id: string;
      course_name: string;
      issued_at: string;
      download_url: string;
    }[];
  };
  continue_learning: {
    course_id: string;
    course_name: string;
    module_id: string;
    module_name: string;
    progress: number;
    thumbnail_url: string;
    link: string;
  };
  unread_notifications: number;
  overall_progress: number;
  average_score: number;
  rank: number;
}
