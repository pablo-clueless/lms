"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useUserStore } from "@/store/core";
import type { Role } from "@/types";

interface UseProtectedRouteProps {
  permissions?: string[];
  redirectTo?: string;
  roles?: Role[];
}

export const useProtectedRoutes = ({ permissions, redirectTo, roles }: UseProtectedRouteProps) => {
  const toastId = useRef<string | null>(null);
  const { user, isHydrated } = useUserStore();
  const router = useRouter();

  const showErrorToast = useCallback((title: string, description: string, id: string) => {
    if (toastId.current !== id) {
      toast.error(title, { description, id, richColors: true });
      toastId.current = id;
    }
  }, []);

  const hasAccess = useMemo(() => {
    // Don't determine access until hydrated
    if (!isHydrated) return false;
    if (!user) return false;

    const hasRoleAccess = user.role && roles?.includes(user.role);

    if (permissions?.length === 0) {
      return Boolean(hasRoleAccess);
    }
    const permissionSet = new Set(user.permissions);
    const hasAllPermissions = permissions?.some((p) => p === "*:*");
    const hasPermissionAccess = permissions?.some((p) => permissionSet.has(p));
    return Boolean(hasRoleAccess || hasAllPermissions || hasPermissionAccess);
  }, [user, roles, permissions, isHydrated]);

  const checkAccess = useCallback(() => {
    // Don't check access until hydrated
    if (!isHydrated) return false;

    if (!user) {
      showErrorToast("Authentication Required", "Please log in to access this page", "auth-required");
      router.replace(redirectTo || "/signin");
      return false;
    }

    if (!hasAccess) {
      showErrorToast("Access Denied", "You don't have permission to access this page", "access-denied");
      router.back();
      return false;
    }

    return true;
  }, [user, hasAccess, redirectTo, router, showErrorToast, isHydrated]);

  useEffect(() => {
    // Only check access after hydration is complete
    if (typeof window !== "undefined" && isHydrated) {
      checkAccess();
    }
    return () => {
      toastId.current = null;
    };
  }, [checkAccess, isHydrated]);

  return { hasAccess, checkAccess, user };
};
