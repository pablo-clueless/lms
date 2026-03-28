import type { NotificationPreferences, Role } from "@/types";

export const NOTIFICATION_PREFERENCES: NotificationPreferences[] = [
  { email_enabled: false, event_type: "ASSIGNMENT_DEADLINE_APPROACHING", in_app_enabled: false, push_enabled: false },
  { email_enabled: false, event_type: "ASSIGNMENT_PUBLISHED", in_app_enabled: false, push_enabled: false },
  { email_enabled: false, event_type: "CUSTOM", in_app_enabled: false, push_enabled: false },
  { email_enabled: false, event_type: "EXAMINATION_SCHEDULED", in_app_enabled: false, push_enabled: false },
  { email_enabled: false, event_type: "EXAMINATION_WINDOW_CLOSE", in_app_enabled: false, push_enabled: false },
  { email_enabled: false, event_type: "EXAMINATION_WINDOW_OPEN", in_app_enabled: false, push_enabled: false },
  { email_enabled: false, event_type: "GRADE_PUBLISHED", in_app_enabled: false, push_enabled: false },
  { email_enabled: false, event_type: "INVOICE_GENERATED", in_app_enabled: false, push_enabled: false },
  { email_enabled: false, event_type: "MEETING_CANCELLED", in_app_enabled: false, push_enabled: false },
  { email_enabled: false, event_type: "MEETING_SCHEDULED", in_app_enabled: false, push_enabled: false },
  { email_enabled: false, event_type: "MEETING_STARTING", in_app_enabled: false, push_enabled: false },
  { email_enabled: false, event_type: "PAYMENT_OVERDUE", in_app_enabled: false, push_enabled: false },
  { email_enabled: false, event_type: "QUIZ_PUBLISHED", in_app_enabled: false, push_enabled: false },
  { email_enabled: false, event_type: "TIMETABLE_PUBLISHED", in_app_enabled: false, push_enabled: false },
  { email_enabled: false, event_type: "TIMETABLE_UPDATED", in_app_enabled: false, push_enabled: false },
];

export const notificationPreferencesByRole = (role: Role) => {
  switch (role) {
    case "STUDENT":
      return NOTIFICATION_PREFERENCES.filter((pref) =>
        [
          "ASSIGNMENT_DEADLINE_APPROACHING",
          "ASSIGNMENT_PUBLISHED",
          "EXAMINATION_SCHEDULED",
          "GRADE_PUBLISHED",
          "QUIZ_PUBLISHED",
          "TIMETABLE_PUBLISHED",
          "TIMETABLE_UPDATED",
        ].includes(pref.event_type),
      );
    case "PARENT":
      return NOTIFICATION_PREFERENCES.filter((pref) =>
        [
          "ASSIGNMENT_DEADLINE_APPROACHING",
          "ASSIGNMENT_PUBLISHED",
          "EXAMINATION_SCHEDULED",
          "GRADE_PUBLISHED",
          "QUIZ_PUBLISHED",
          "TIMETABLE_PUBLISHED",
          "TIMETABLE_UPDATED",
        ].includes(pref.event_type),
      );
    case "TUTOR":
      return NOTIFICATION_PREFERENCES.filter((pref) =>
        [
          "ASSIGNMENT_PUBLISHED",
          "EXAMINATION_SCHEDULED",
          "INVOICE_GENERATED",
          "MEETING_SCHEDULED",
          "QUIZ_PUBLISHED",
          "TIMETABLE_PUBLISHED",
          "TIMETABLE_UPDATED",
        ].includes(pref.event_type),
      );
    case "SUPER_ADMIN":
      return NOTIFICATION_PREFERENCES.filter((pref) =>
        ["CUSTOM", "INVOICE_GENERATED", "PAYMENT_OVERDUE"].includes(pref.event_type),
      );
    case "ADMIN":
      return NOTIFICATION_PREFERENCES;
    default:
      return [];
  }
};
