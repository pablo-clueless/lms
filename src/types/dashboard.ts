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
  };
}

export interface QuickActions {
  label: string;
  action: string;
  icon: string;
}

export interface AdminDashboardResponse {
  role: "ADMIN";
  admin: {
    enrollment: {
      active_students: number;
      total_seats: number;
      seats_remaining: number;
      new_this_month: number;
      churned_this_month: number;
    };
    course_completion: {
      total_started: number;
      total_completed: number;
      completion_rate: number;
      avg_time_to_complete_days: number;
    };
    tutor_performance: {
      tutor_id: string;
      tutor_name: string;
      avg_grading_time_days: number;
      avg_course_rating: number;
      student_count: number;
      pending_grading: number;
    }[];
    popular_courses: {
      course_id: string;
      course_name: string;
      enroll_count: number;
      view_count: number;
      completion_rate: number;
    }[];
    pending_actions: {
      unassigned_students: number;
      pending_approvals: number;
      pending_applications: number;
      ungraded_submissions: number;
    };
    total_students: number;
    total_tutors: number;
    total_courses: number;
    active_terms: number;
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
