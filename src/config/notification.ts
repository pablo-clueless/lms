import type { IconSvgElement } from "@hugeicons/react";
import {
  AddInvoiceIcon,
  Appointment01Icon,
  AssignmentsIcon,
  Calendar03Icon,
  CalendarAdd01Icon,
  CalendarRemove01Icon,
  CalendarSyncIcon,
  CheckListIcon,
  CreditCardNotAcceptIcon,
  Quiz03Icon,
  Setting06Icon,
  TimeQuarterPassIcon,
} from "@hugeicons/core-free-icons";

import type { NotificationEventType, NotificationPreferences, NotificationPriority, Role } from "@/types";

export const NOTIFICATION_COLORS: Record<NotificationPriority, string> = {
  LOW: "bg-gray-100 text-gray-600",
  NORMAL: "bg-blue-100 text-blue-600",
  HIGH: "bg-orange-100 text-orange-600",
  URGENT: "bg-re-100 text-red-600",
};

export const NOTIFICATION_ICONS: Record<NotificationEventType, IconSvgElement> = {
  ASSIGNMENT_DEADLINE_APPROACHING: TimeQuarterPassIcon,
  ASSIGNMENT_PUBLISHED: AssignmentsIcon,
  CUSTOM: Setting06Icon,
  EXAMINATION_SCHEDULED: CalendarAdd01Icon,
  EXAMINATION_WINDOW_CLOSE: CalendarRemove01Icon,
  EXAMINATION_WINDOW_OPEN: Appointment01Icon,
  GRADE_PUBLISHED: CheckListIcon,
  INVOICE_GENERATED: AddInvoiceIcon,
  MEETING_CANCELLED: CalendarRemove01Icon,
  MEETING_SCHEDULED: CalendarAdd01Icon,
  MEETING_STARTING: Appointment01Icon,
  PAYMENT_OVERDUE: CreditCardNotAcceptIcon,
  QUIZ_PUBLISHED: Quiz03Icon,
  TIMETABLE_PUBLISHED: Calendar03Icon,
  TIMETABLE_UPDATED: CalendarSyncIcon,
};

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
