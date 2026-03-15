"use client";

import React, { useEffect } from "react";

import { useProtectedRoutes, useRbac } from "@/hooks";
import { useUserStore } from "@/store/core";
import type { Role } from "@/types";
import { Loader } from "../shared";

interface WithAuthProps {
  children: React.ReactNode;
  enableRbacRedirect?: boolean;
  fallback?: React.ReactNode;
  permissions?: string[];
  roles: Role[];
  redirectTo?: string;
}

export const WithAuth = React.memo(
  ({
    children,
    enableRbacRedirect,
    fallback = <Loader isFullScreen />,
    permissions,
    roles,
    redirectTo,
  }: WithAuthProps) => {
    const { user, isHydrated, hydrate } = useUserStore();
    const handleRbac = useRbac();

    useEffect(() => {
      hydrate();
    }, [hydrate]);

    const { hasAccess } = useProtectedRoutes({
      permissions,
      redirectTo,
      roles,
    });

    useEffect(() => {
      if (isHydrated && !hasAccess && enableRbacRedirect) {
        handleRbac(user);
      }
    }, [isHydrated, hasAccess, enableRbacRedirect, handleRbac, user]);

    if (!isHydrated) {
      return fallback;
    }

    if (!hasAccess) {
      return fallback;
    }

    return children;
  },
);

WithAuth.displayName = "WithAuth";
