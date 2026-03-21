import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateMeetingDto, Meeting, Pagination, QueryParams } from "@/types";
import { apiClient } from "../api-client";

type UpdateMeeting = {
  id: string;
  body: Partial<CreateMeetingDto>;
};

interface MeetingQueries {
  status?: "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED";
}

const keys = {
  all: ["meetings"] as const,
  list: () => [...keys.all, "get-meetings"],
  get: (id: string) => [...keys.all, "get-meeting", id],
  create: () => [...keys.all, "schedule-meeting"],
  update: () => [...keys.all, "update-meeting"],
  start: () => [...keys.all, "start-meeting"],
  end: () => [...keys.all, "end-meeting"],
  join: (id: string) => [...keys.all, "join-meeting", id],
};

interface ListMeetingResponse {
  meetings: Meeting[];
  pagination: Pagination;
}

interface JoinMeetingResponse {
  join_url: string;
}

const meetingApi = {
  list: (params?: MeetingQueries) => apiClient.get<ListMeetingResponse>("/meetings", params as QueryParams),
  get: (id: string) => apiClient.get<Meeting>(`/meetings/${id}`),
  create: (body: CreateMeetingDto) => apiClient.post<Meeting>("/meetings", body),
  update: (payload: UpdateMeeting) => apiClient.put<Meeting>(`/meetings/${payload.id}`, payload.body),
  start: (id: string) => apiClient.post<Meeting>(`/meetings/${id}/start`),
  end: (id: string) => apiClient.post<Meeting>(`/meetings/${id}/end`),
  join: (id: string) => apiClient.get<JoinMeetingResponse>(`/meetings/${id}/join`),
};

export function useGetMeetings(params?: MeetingQueries) {
  return useQuery({
    queryKey: keys.list(),
    queryFn: () => meetingApi.list(params),
  });
}

export function useGetMeeting(id: string) {
  return useQuery({
    queryKey: keys.get(id),
    queryFn: () => meetingApi.get(id),
    enabled: !!id,
  });
}

export function useScheduleMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.create(),
    mutationFn: meetingApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useUpdateMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.update(),
    mutationFn: meetingApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useStartMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.start(),
    mutationFn: meetingApi.start,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useEndMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.end(),
    mutationFn: meetingApi.end,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useGetJoinUrl(id: string) {
  return useQuery({
    queryKey: keys.join(id),
    queryFn: () => meetingApi.join(id),
    enabled: !!id,
  });
}
