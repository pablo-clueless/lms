import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Enrollment, Pagination, PaginationParams, QueryParams } from "@/types";
import { apiClient } from "../api-client";

export interface CreateEnrollmentDto {
  email: string;
  first_name: string;
  last_name: string;
  class_id: string;
  middle_name?: string;
  phone?: string;
}

interface EnrollStudentDto {
  student_id: string;
  class_id: string;
}

interface TransferStudentDto {
  target_class_id: string;
}

interface EnrollmentQueries {
  class_id?: string;
  student_id?: string;
}

const keys = {
  all: ["enrollments"] as const,
  list: () => [...keys.all, "get-enrollments"],
  get: (id: string) => [...keys.all, "get-enrollment", id],
  enroll: () => [...keys.all, "enroll-student"],
  create: () => [...keys.all, "create-student"],
  transfer: () => [...keys.all, "transfer-student"],
};

interface ListEnrollmentResponse {
  enrollments: Enrollment[];
  pagination: Pagination;
}

const enrollmentApi = {
  list: (params?: PaginationParams & EnrollmentQueries) =>
    apiClient.get<ListEnrollmentResponse>("/enrollments", params as QueryParams),
  get: (id: string) => apiClient.get<Enrollment>(`/enrollments/${id}`),
  enroll: (body: EnrollStudentDto) => apiClient.post<Enrollment>("/enrollments", body),
  create: (body: CreateEnrollmentDto) => apiClient.post<Enrollment>("/enrollments/create-student", body),
  transfer: (id: string, body: TransferStudentDto) => apiClient.post<Enrollment>(`/enrollments/${id}/transfer`, body),
};

export function useGetEnrollments(params?: PaginationParams & EnrollmentQueries) {
  return useQuery({
    queryKey: keys.list(),
    queryFn: () => enrollmentApi.list(params),
  });
}

export function useGetEnrollment(id: string) {
  return useQuery({
    queryKey: keys.get(id),
    queryFn: () => enrollmentApi.get(id),
    enabled: !!id,
  });
}

export function useEnrollStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.enroll(),
    mutationFn: enrollmentApi.enroll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.create(),
    mutationFn: enrollmentApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useTransferStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.transfer(),
    mutationFn: ({ id, body }: { id: string; body: TransferStudentDto }) => enrollmentApi.transfer(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}
