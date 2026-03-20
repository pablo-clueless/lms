export type MeetingStatus = "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED";
export type MeetingProvider = "DAILY" | "ZOOM" | "JITSI" | "CUSTOM";

export interface ParticipantEvent {
  user_id: string;
  event_type: "JOIN" | "LEAVE";
  timestamp: Date;
  duration?: number;
}

export interface Meeting {
  id: string;
  tenant_id: string;
  class_id: string;
  course_id?: string;
  host_tutor_id: string;
  title: string;
  description?: string;
  scheduled_start: Date;
  estimated_duration: number;
  status: MeetingStatus;
  provider: MeetingProvider;
  meeting_url: string;
  provider_meeting_id: string;
  access_code?: string;
  actual_start_time?: Date;
  actual_end_time?: Date;
  recording_url?: string;
  recording_expires_at?: Date;
  participant_events: ParticipantEvent[];
  cancellation_reason?: string;
  cancelled_by?: string;
  cancelled_at?: Date;
  created_at: Date;
  updated_at: Date;
}
