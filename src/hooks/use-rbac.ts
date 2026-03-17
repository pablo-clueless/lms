"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import type { Maybe, Role, User } from "@/types";

const roleRoutes: Record<Role, string> = {
  SUPER_ADMIN: "/superadmin",
  ADMIN: "/admin",
  TUTOR: "/tutor",
  STUDENT: "/student",
};

export const useRbac = () => {
  const router = useRouter();

  const handleRbac = useCallback(
    (user: Maybe<User>) => {
      if (!user || !user.role) {
        router.push("/signin");
        return;
      }
      const redirect = roleRoutes[user.role] || "/signin";
      router.push(redirect);
    },
    [router],
  );

  return handleRbac;
};
