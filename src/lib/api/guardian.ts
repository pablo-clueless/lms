import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  Class,
  Enrollment,
  GuardianRelationship,
  Invoice,
  Pagination,
  PaginationParams,
  Progress,
  QueryParams,
  Session,
  User,
} from "@/types";
import { apiClient } from "../api-client";

export type GuardianStatus = "ACTIVE" | "INACTIVE";

export interface GuardianWithDetails {
  id: string;
  tenant_id: string;
  guardian_id: string;
  student_id: string;
  relationship: GuardianRelationship;
  is_primary: boolean;
  status: GuardianStatus;
  notes: string;
  guardian_user?: User;
  student_user?: User;
  created_at: string;
  updated_at: string;
}

export interface CreateGuardianDto {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  student_id: string;
  relationship: GuardianRelationship | (string & {});
  is_primary: boolean;
  notes: string;
}

export interface LinkWardDto {
  student_id: string;
  relationship: GuardianRelationship | (string & {});
  is_primary?: boolean;
  notes?: string;
}

export interface WardSummary {
  student: User;
  class?: Class;
  session?: Session;
  enrollment?: Enrollment;
}

export interface WardInvoicesResponse {
  ward: WardSummary;
  invoices: Invoice[];
}

export interface WardProgressResponse {
  ward: WardSummary;
  progress: Progress[];
}

interface ListGuardiansResponse {
  data: GuardianWithDetails[];
  pagination: Pagination;
}

interface ListWardsResponse {
  pagination: Pagination;
  wards: GuardianWithDetails[];
}

type LinkWard = {
  guardianId: string;
  body: LinkWardDto;
};

const keys = {
  all: ["guardians"] as const,
  list: (params?: PaginationParams) => [...keys.all, "list", params] as const,
  create: () => [...keys.all, "create"] as const,
  myWards: (params?: PaginationParams) => [...keys.all, "my-wards", params] as const,
  studentGuardians: (studentId: string, params?: PaginationParams) =>
    [...keys.all, "student-guardians", studentId, params] as const,
  wardInvoices: (studentId: string) => [...keys.all, "ward-invoices", studentId] as const,
  wardProgress: (studentId: string) => [...keys.all, "ward-progress", studentId] as const,
  linkWard: () => [...keys.all, "link-ward"] as const,
  unlinkWard: () => [...keys.all, "unlink-ward"] as const,
};

const guardianApi = {
  list: (params?: PaginationParams) => apiClient.get<ListGuardiansResponse>("/guardians", params as QueryParams),
  create: (body: CreateGuardianDto) => apiClient.post<GuardianWithDetails>("/guardians/create-and-link", body),
  getMyWards: (params?: PaginationParams) =>
    apiClient.get<ListWardsResponse>("/guardians/my-wards", params as QueryParams),
  getStudentGuardians: (studentId: string, params?: PaginationParams) =>
    apiClient.get<ListGuardiansResponse>(`/guardians/students/${studentId}`, params as QueryParams),
  getWardInvoices: (studentId: string) => apiClient.get<WardInvoicesResponse>(`/guardians/wards/${studentId}/invoices`),
  getWardProgress: (studentId: string) => apiClient.get<WardProgressResponse>(`/guardians/wards/${studentId}/progress`),
  linkWard: (payload: LinkWard) =>
    apiClient.post<GuardianWithDetails>(`/guardians/${payload.guardianId}/wards`, payload.body),
  unlinkWard: (id: string) => apiClient.delete<void>(`/guardians/${id}`),
};

export function useCreateGuardian() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.create(),
    mutationFn: guardianApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}

export function useGetGuardians(params?: PaginationParams) {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: () => guardianApi.list(params),
  });
}

export function useGetMyWards(params?: PaginationParams) {
  return useQuery({
    queryKey: keys.myWards(params),
    queryFn: () => guardianApi.getMyWards(params),
  });
}

export function useGetStudentGuardians(studentId: string, params?: PaginationParams) {
  return useQuery({
    queryKey: keys.studentGuardians(studentId, params),
    queryFn: () => guardianApi.getStudentGuardians(studentId, params),
    enabled: !!studentId,
  });
}

export function useGetWardInvoices(studentId: string) {
  return useQuery({
    queryKey: keys.wardInvoices(studentId),
    queryFn: () => guardianApi.getWardInvoices(studentId),
    enabled: !!studentId,
  });
}

export function useGetWardProgress(studentId: string) {
  return useQuery({
    queryKey: keys.wardProgress(studentId),
    queryFn: () => guardianApi.getWardProgress(studentId),
    enabled: !!studentId,
  });
}

export function useLinkWard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.linkWard(),
    mutationFn: guardianApi.linkWard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}

export function useUnlinkWard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.unlinkWard(),
    mutationFn: guardianApi.unlinkWard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}
