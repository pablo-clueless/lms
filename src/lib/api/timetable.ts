import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateTimeTableDto, Timetable, QueryParams } from "@/types";
import { apiClient } from "../api-client";

interface TimetableQueries {
  class_id?: string;
  term_id?: string;
}

interface SwapRequest {
  id: string;
  from_period_id: string;
  to_period_id: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requested_by: string;
  created_at: Date;
}

interface CreateSwapRequestDto {
  from_period_id: string;
  to_period_id: string;
  reason: string;
}

const keys = {
  all: ["timetables"] as const,
  list: () => [...keys.all, "get-timetables"] as const,
  get: (id: string) => [...keys.all, "get-timetable", id] as const,
  class: (classId: string, termId?: string) => [...keys.all, "class", classId, termId] as const,
  generate: () => [...keys.all, "generate-timetable"] as const,
  publish: () => [...keys.all, "publish-timetable"] as const,
  swapRequests: () => [...keys.all, "swap-requests"] as const,
  createSwap: () => [...keys.all, "create-swap"] as const,
  archive: (id: string) => [...keys.all, "archive", id] as const,
};

interface ListTimetableResponse {
  data: Timetable[];
}

interface ListSwapRequestResponse {
  data: SwapRequest[];
}

const timetableApi = {
  list: (params?: TimetableQueries) => apiClient.get<ListTimetableResponse>("/timetables", params as QueryParams),
  get: (id: string) => apiClient.get<Timetable>(`/timetables/${id}`),
  class: (classId: string, termId?: string) =>
    apiClient.get<Timetable>(`/timetables/class/${classId}`, { term_id: termId }),
  generate: (body: CreateTimeTableDto) => apiClient.post<Timetable>("/timetables/generate", body),
  publish: (id: string) => apiClient.post<Timetable>(`/timetables/${id}/publish`),
  listSwapRequests: () => apiClient.get<ListSwapRequestResponse>("/timetables/swap-requests"),
  createSwapRequest: (body: CreateSwapRequestDto) => apiClient.post<SwapRequest>("/timetables/swap-requests", body),
  archive: (id: string) => apiClient.post<Timetable>(`/timetables/${id}/archive`),
};

export function useGetTimetables(params?: TimetableQueries) {
  return useQuery({
    queryKey: keys.list(),
    queryFn: () => timetableApi.list(params),
  });
}

export function useGetTimetable(id: string) {
  return useQuery({
    queryKey: keys.get(id),
    queryFn: () => timetableApi.get(id),
    enabled: !!id,
  });
}

export function useGetTimetableForClass(class_id: string, term_id?: string) {
  return useQuery({
    queryKey: keys.class(class_id, term_id),
    queryFn: () => timetableApi.class(class_id, term_id),
    enabled: !!class_id,
  });
}

export function useGenerateTimetable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.generate(),
    mutationFn: timetableApi.generate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function usePublishTimetable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.publish(),
    mutationFn: timetableApi.publish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useGetSwapRequests() {
  return useQuery({
    queryKey: keys.swapRequests(),
    queryFn: () => timetableApi.listSwapRequests(),
  });
}

export function useCreateSwapRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.createSwap(),
    mutationFn: timetableApi.createSwapRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.swapRequests() });
    },
  });
}

export function useArchiveTimetable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.archive(""),
    mutationFn: timetableApi.archive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}
