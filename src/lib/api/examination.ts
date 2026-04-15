import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  CreateExaminationDto,
  Examination,
  ExaminationAnswer,
  ExaminationSubmission,
  Pagination,
  QueryParams,
} from "@/types";
import { apiClient } from "../api-client";

type UpdateExamination = {
  id: string;
  body: Partial<CreateExaminationDto>;
};

interface ExaminationQueries {
  course_id?: string;
  status?: "DRAFT" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "GRADED";
}

interface ScheduleExaminationDto {
  window_start: string;
  window_end: string;
}

const keys = {
  all: ["examinations"] as const,
  list: () => [...keys.all, "get-examinations"],
  get: (id: string) => [...keys.all, "get-examination", id],
  create: () => [...keys.all, "create-examination"],
  update: () => [...keys.all, "update-examination"],
  delete: () => [...keys.all, "delete-examination"],
  schedule: () => [...keys.all, "schedule-examination"],
  submissions: (id: string) => [...keys.all, "submissions", id],
};

interface ListExaminationResponse {
  examinations: Examination[];
  pagination: Pagination;
}

interface ListSubmissionResponse {
  data: ExaminationSubmission[];
}

interface SubmitExaminationDto {
  answers: ExaminationAnswer[];
}

const examinationApi = {
  list: (params?: ExaminationQueries) => apiClient.get<ListExaminationResponse>("/examinations", params as QueryParams),
  get: (id: string) => apiClient.get<Examination>(`/examinations/${id}`),
  create: (body: CreateExaminationDto) => apiClient.post<Examination>("/examinations", body),
  update: (payload: UpdateExamination) => apiClient.put<Examination>(`/examinations/${payload.id}`, payload.body),
  delete: (id: string) => apiClient.delete<void>(`/examinations/${id}`),
  schedule: (id: string, body: ScheduleExaminationDto) =>
    apiClient.post<Examination>(`/examinations/${id}/schedule`, body),
  listSubmissions: (id: string) => apiClient.get<ListSubmissionResponse>(`/examinations/${id}/submissions`),
  start: (id: string) => apiClient.post(`/examinations/${id}/start`),
  submit: (id: string, body: SubmitExaminationDto) => apiClient.post(`/examinations/${id}/submit`, body),
};

export function useGetExaminations(params?: ExaminationQueries) {
  return useQuery({
    queryKey: keys.list(),
    queryFn: () => examinationApi.list(params),
  });
}

export function useGetExamination(id: string) {
  return useQuery({
    queryKey: keys.get(id),
    queryFn: () => examinationApi.get(id),
    enabled: !!id,
  });
}

export function useCreateExamination() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.create(),
    mutationFn: examinationApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useUpdateExamination() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.update(),
    mutationFn: examinationApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useDeleteExamination() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.delete(),
    mutationFn: examinationApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useScheduleExamination() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.schedule(),
    mutationFn: ({ id, body }: { id: string; body: ScheduleExaminationDto }) => examinationApi.schedule(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useGetExaminationSubmissions(id: string) {
  return useQuery({
    queryKey: keys.submissions(id),
    queryFn: () => examinationApi.listSubmissions(id),
    enabled: !!id,
  });
}

export function useStartExamination() {
  return useMutation({
    mutationKey: [...keys.all, "start-examination"],
    mutationFn: (id: string) => examinationApi.start(id),
  });
}

export function useSubmitExamination() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [...keys.all, "submit-examination"],
    mutationFn: ({ id, body }: { id: string; body: SubmitExaminationDto }) => examinationApi.submit(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: keys.get(id) });
      queryClient.invalidateQueries({ queryKey: keys.submissions(id) });
    },
  });
}

export type { SubmitExaminationDto };
