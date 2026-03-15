"use clioent";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import type { Maybe, User } from "@/types";

export const useRbac = () => {
  const router = useRouter();

  const handleRbac = useCallback(
    (user: Maybe<User>) => {
      if (!user || !user.role) {
        router.push("/signin");
        return;
      }
      const redirect = user.role === "ADMIN" ? "/admin" : "/dashboard";
      router.push(redirect);
    },
    [router],
  );

  return handleRbac;
};
