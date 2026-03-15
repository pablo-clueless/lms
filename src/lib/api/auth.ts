import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { HttpResponse, RefreshDto, RefreshResponse, SigninDto, SigninResponse, SignupDto } from "@/types";
import { apiClient } from "../api-client";

const authKeys = {
  all: ["auth"] as const,
  signin: () => [...authKeys.all, "signin"] as const,
  signup: () => [...authKeys.all, "signup"] as const,
  refresh: () => [...authKeys.all, "refresh"] as const,
};

const authApi = {
  signin: (body: SigninDto) => apiClient.post<HttpResponse<SigninResponse>>("/auth/signin", body),
  signup: (body: SignupDto) => apiClient.post<HttpResponse<unknown>>("/auth/signup", body),
  refresh: (body: RefreshDto) => apiClient.post<HttpResponse<RefreshResponse>>("/auth/refresh", body),
};

export const useSignin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.signin,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.signin(), data);
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.signup(), data);
    },
  });
};

export const useRefresh = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.refresh,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.refresh(), data);
    },
  });
};
