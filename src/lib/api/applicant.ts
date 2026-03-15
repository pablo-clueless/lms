import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Applicant, ApplicantStatus, HttpResponse, PaginatedResponse, PaginationParams } from "@/types";
import { apiClient } from "../api-client";

interface RegisterApplicantInput {
  tenant_id: string;
  email: string;
  name: string;
  password: string;
  cohort_id: string;
  track_id: string;
}

interface SubmitApplicationInput {
  token: string;
  form_data: Record<string, unknown>;
}

interface TokenValidationData {
  valid: boolean;
  applicant_id: string;
  email: string;
  name: string;
  cohort_id: string;
  track_id: string;
  cohort_name: string;
  track_name: string;
  expires_at: string;
  form_fields: unknown[];
}

const applicantKeys = {
  all: ["applicants"] as const,
  getApplicants: () => [...applicantKeys.all, "getApplicants"] as const,
  getApplicant: (id: string) => [...applicantKeys.all, "getApplicant", id] as const,
  getCohortApplicants: (cohortId: string) => [...applicantKeys.all, "getCohortApplicants", cohortId] as const,
  validateToken: (token: string) => [...applicantKeys.all, "validateToken", token] as const,
};

const applicantApi = {
  registerApplicant: (data: RegisterApplicantInput) =>
    apiClient.post<HttpResponse<{ applicant_id: string; email: string }>>("/applicants/register", data),
  validateToken: (token: string) =>
    apiClient.get<HttpResponse<TokenValidationData>>("/applicants/validate-token", { params: { token } }),
  submitApplication: (data: SubmitApplicationInput) =>
    apiClient.post<HttpResponse<{ applicant: Applicant }>>("/applicants/submit", data),
  resendToken: (id: string) => apiClient.post<HttpResponse<{ message: string }>>(`/applicants/${id}/resend-token`, {}),
  getApplicants: (params: PaginationParams) => apiClient.get<PaginatedResponse<Applicant>>("/applicants", { params }),
  getApplicant: (id: string) => apiClient.get<HttpResponse<Applicant>>(`/applicants/${id}`),
  updateApplicantStatus: (id: string, status: ApplicantStatus) =>
    apiClient.put<HttpResponse<{ message: string }>>(`/applicants/${id}/status`, { status }),
  getCohortApplicants: (cohortId: string, params: PaginationParams) =>
    apiClient.get<PaginatedResponse<Applicant>>(`/cohorts/${cohortId}/applicants`, { params }),
};

export const useValidateToken = (token: string) =>
  useQuery({
    queryKey: applicantKeys.validateToken(token),
    queryFn: () => applicantApi.validateToken(token),
    enabled: !!token,
  });

export const useGetApplicants = (params: PaginationParams) =>
  useQuery({ queryKey: applicantKeys.getApplicants(), queryFn: () => applicantApi.getApplicants(params) });

export const useGetApplicant = (id: string) =>
  useQuery({ queryKey: applicantKeys.getApplicant(id), queryFn: () => applicantApi.getApplicant(id) });

export const useGetCohortApplicants = (cohortId: string, params: PaginationParams) =>
  useQuery({
    queryKey: applicantKeys.getCohortApplicants(cohortId),
    queryFn: () => applicantApi.getCohortApplicants(cohortId, params),
  });

export const useRegisterApplicant = () =>
  useMutation({ mutationFn: (data: RegisterApplicantInput) => applicantApi.registerApplicant(data) });

export const useSubmitApplication = () =>
  useMutation({ mutationFn: (data: SubmitApplicationInput) => applicantApi.submitApplication(data) });

export const useResendToken = () => useMutation({ mutationFn: (id: string) => applicantApi.resendToken(id) });

export const useUpdateApplicantStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicantStatus }) =>
      applicantApi.updateApplicantStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: applicantKeys.getApplicant(id) });
      queryClient.invalidateQueries({ queryKey: applicantKeys.getApplicants() });
    },
  });
};
