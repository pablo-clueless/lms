"use client";

import React from "react";

import type { Maybe, User } from "@/types";

export type PermissionMode = "any" | "one" | "strict";

interface Props {
  mode: PermissionMode;
  permissions: string[];
  user: Maybe<User>;
}

export const usePermissions = ({ mode, permissions, user }: Props): boolean => {
  return React.useMemo(() => {
    if (!user) return false;
    if (!user.role) return false;
    if (!user.permissions?.length) return false;
    const permissionSet = new Set(user.permissions.map((permission) => permission));
    switch (mode) {
      case "any":
        return permissions.some((permission) => permissionSet.has(permission));
      case "one":
        return permissions.reduce((acc, permission) => acc + (permissionSet.has(permission) ? 1 : 0), 0) === 1;
      case "strict":
        return permissions.every((permission) => permissionSet.has(permission));
    }
  }, [mode, permissions, user]);
};
