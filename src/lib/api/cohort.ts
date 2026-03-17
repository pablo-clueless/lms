import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  ApplicationForm,
  Cohort,
  CreateApplicationFormDto,
  HttpResponse,
  PaginatedResponse,
  PaginationParams,
  Track,
} from "@/types";
import { apiClient } from "../api-client";

// ─── Cohorts ────────────────────────────────────────────────────────────────

const cohortKeys = {
  all: ["cohorts"] as const,
  getCohorts: () => [...cohortKeys.all, "getCohorts"] as const,
  getCohort: (id: string) => [...cohortKeys.all, "getCohort", id] as const,
  getCohortApplicationForm: (id: string) => [...cohortKeys.all, "getCohortApplicationForm", id] as const,
  getCohortApplicants: (id: string) => [...cohortKeys.all, "getCohortApplicants", id] as const,
};

const cohortApi = {
  getCohorts: (params: PaginationParams) => apiClient.get<PaginatedResponse<Cohort>>("/cohorts", { params }),
  getCohort: (id: string) => apiClient.get<HttpResponse<Cohort>>(`/cohorts/${id}`),
  createCohort: (data: Partial<Cohort>) => apiClient.post<HttpResponse<Cohort>>("/cohorts", data),
  updateCohort: (id: string, data: Partial<Cohort>) => apiClient.put<HttpResponse<Cohort>>(`/cohorts/${id}`, data),
  deleteCohort: (id: string) => apiClient.delete<HttpResponse<unknown>>(`/cohorts/${id}`),
  getCohortApplicationForm: (id: string) =>
    apiClient.get<HttpResponse<ApplicationForm>>(`/cohorts/${id}/application-form`),
};

export const useGetCohorts = (params: PaginationParams) =>
  useQuery({ queryKey: cohortKeys.getCohorts(), queryFn: () => cohortApi.getCohorts(params) });

export const useGetCohort = (id: string) =>
  useQuery({ queryKey: cohortKeys.getCohort(id), queryFn: () => cohortApi.getCohort(id) });

export const useGetCohortApplicationForm = (id: string) =>
  useQuery({
    queryKey: cohortKeys.getCohortApplicationForm(id),
    queryFn: () => cohortApi.getCohortApplicationForm(id),
  });

export const useCreateCohort = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Cohort>) => cohortApi.createCohort(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cohortKeys.getCohorts() }),
  });
};

export const useUpdateCohort = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Cohort>) => cohortApi.updateCohort(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cohortKeys.getCohort(id) });
      queryClient.invalidateQueries({ queryKey: cohortKeys.getCohorts() });
    },
  });
};

export const useDeleteCohort = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cohortApi.deleteCohort(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cohortKeys.getCohorts() }),
  });
};

// ─── Tracks ─────────────────────────────────────────────────────────────────

const trackKeys = {
  all: ["tracks"] as const,
  getTracks: () => [...trackKeys.all, "getTracks"] as const,
  getTrack: (id: string) => [...trackKeys.all, "getTrack", id] as const,
};

const trackApi = {
  getTracks: (params: PaginationParams) => apiClient.get<PaginatedResponse<Track>>("/tracks", { params }),
  getTrack: (id: string) => apiClient.get<HttpResponse<Track>>(`/tracks/${id}`),
  createTrack: (data: Partial<Track>) => apiClient.post<HttpResponse<Track>>("/tracks", data),
  updateTrack: (id: string, data: Partial<Track>) => apiClient.put<HttpResponse<Track>>(`/tracks/${id}`, data),
  deleteTrack: (id: string) => apiClient.delete<HttpResponse<unknown>>(`/tracks/${id}`),
};

export const useGetTracks = (params: PaginationParams) =>
  useQuery({ queryKey: trackKeys.getTracks(), queryFn: () => trackApi.getTracks(params) });

export const useGetTrack = (id: string) =>
  useQuery({ queryKey: trackKeys.getTrack(id), queryFn: () => trackApi.getTrack(id) });

export const useCreateTrack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Track>) => trackApi.createTrack(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trackKeys.getTracks() }),
  });
};

export const useUpdateTrack = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Track>) => trackApi.updateTrack(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackKeys.getTrack(id) });
      queryClient.invalidateQueries({ queryKey: trackKeys.getTracks() });
    },
  });
};

export const useDeleteTrack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trackApi.deleteTrack(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trackKeys.getTracks() }),
  });
};

// ─── Application Forms ───────────────────────────────────────────────────────

const applicationFormKeys = {
  all: ["application-forms"] as const,
  getApplicationForms: () => [...applicationFormKeys.all, "getApplicationForms"] as const,
  getApplicationForm: (id: string) => [...applicationFormKeys.all, "getApplicationForm", id] as const,
};

const applicationFormApi = {
  getApplicationForms: (params: PaginationParams) =>
    apiClient.get<PaginatedResponse<ApplicationForm>>("/application-forms", { params }),
  getApplicationForm: (id: string) => apiClient.get<HttpResponse<ApplicationForm>>(`/application-forms/${id}`),
  createApplicationForm: (data: Partial<CreateApplicationFormDto>) =>
    apiClient.post<HttpResponse<ApplicationForm>>("/application-forms", data),
  updateApplicationForm: (id: string, data: Partial<ApplicationForm>) =>
    apiClient.put<HttpResponse<ApplicationForm>>(`/application-forms/${id}`, data),
  deleteApplicationForm: (id: string) => apiClient.delete<HttpResponse<unknown>>(`/application-forms/${id}`),
};

export const useGetApplicationForms = (params: PaginationParams) =>
  useQuery({
    queryKey: applicationFormKeys.getApplicationForms(),
    queryFn: () => applicationFormApi.getApplicationForms(params),
  });

export const useGetApplicationForm = (id: string) =>
  useQuery({
    queryKey: applicationFormKeys.getApplicationForm(id),
    queryFn: () => applicationFormApi.getApplicationForm(id),
  });

export const useCreateApplicationForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateApplicationFormDto>) => applicationFormApi.createApplicationForm(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationFormKeys.getApplicationForms() }),
  });
};

export const useUpdateApplicationForm = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ApplicationForm>) => applicationFormApi.updateApplicationForm(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationFormKeys.getApplicationForm(id) });
      queryClient.invalidateQueries({ queryKey: applicationFormKeys.getApplicationForms() });
    },
  });
};

export const useDeleteApplicationForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationFormApi.deleteApplicationForm(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationFormKeys.getApplicationForms() }),
  });
};
