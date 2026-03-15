import { useQuery } from "@tanstack/react-query";

import type { HttpResponse } from "@/types";
import { apiClient } from "../api-client";

interface Permission {
  permission: string;
  resource: string;
  action: string;
  description: string;
}

const permissionKeys = {
  all: ["permissions"] as const,
  getPermissions: () => [...permissionKeys.all, "getPermissions"] as const,
};

const permissionApi = {
  getPermissions: () => apiClient.get<HttpResponse<Permission[]>>("/permissions"),
};

export const useGetPermissions = () =>
  useQuery({ queryKey: permissionKeys.getPermissions(), queryFn: () => permissionApi.getPermissions() });
