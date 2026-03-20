import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { RegisterDto, SigninDto, SigninResponse, User } from "@/types";
import { apiClient } from "../api-client";

const keys = {
  all: ["auth"] as const,
  login: () => [...keys.all, "login"] as const,
  register: () => [...keys.all, "register"] as const,
  forgot_password: () => [...keys.all, "forgot-password"] as const,
  reset_password: () => [...keys.all, "reset-password"] as const,
};

const authApi = {
  login: (body: SigninDto) => apiClient.post<SigninResponse>("/public/auth/login", body),
  register: (body: RegisterDto) => apiClient.post<User>("/public/auth/register", body),
  forgot_password: (body: { email: string }) => apiClient.post<null>("/public/auth/password-reset", body),
  reset_password: () => apiClient.post<null>("/public/auth/"),
};

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.login(),
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(keys.login(), data);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.register(),
    mutationFn: authApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData(keys.register(), data);
    },
  });
}

export function useForgotPassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.forgot_password(),
    mutationFn: authApi.forgot_password,
    onSuccess: (data) => {
      queryClient.setQueryData(keys.forgot_password(), data);
    },
  });
}

export function useResetPassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.reset_password(),
    mutationFn: () => authApi.reset_password(),
    onSuccess: (data) => {
      queryClient.setQueryData(keys.reset_password(), data);
    },
  });
}
