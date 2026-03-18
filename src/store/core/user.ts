import Cookies from "js-cookie";

import type { Maybe, SigninResponse, TTenant, User } from "@/types";
import { createPersistMiddleware } from "../middleware";

interface SignInOptions {
  expiresIn?: number;
  remember?: boolean;
}

interface SignOutOptions {
  callbackUrl?: string;
  clearStorage?: boolean;
  redirectUrl?: string;
  soft?: boolean;
}

interface UserStore {
  hydrate: () => void;
  isHydrated: boolean;
  signin: (payload: SigninResponse, options?: SignInOptions) => void;
  signout: (options?: SignOutOptions) => void;
  tenant: Maybe<TTenant>;
  update: (user: User) => void;
  user: Maybe<User>;
}

const initialState: UserStore = {
  hydrate: () => {},
  isHydrated: false,
  signin: () => {},
  signout: () => {},
  tenant: null,
  update: () => {},
  user: null,
};

const getCookieOptions = (expiresIn?: number) => ({
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  expires: expiresIn || 7, // Default 7 days
});

export const useUserStore = createPersistMiddleware<UserStore>("USER_STORE", (set, get) => ({
  ...initialState,
  hydrate: () => {
    if (typeof window !== "undefined" && !get().isHydrated) {
      const accessToken = Cookies.get("ACCESS_TOKEN");
      const refreshToken = Cookies.get("REFRESH_TOKEN");
      if (!accessToken && !refreshToken && get().user) {
        set({ user: null, tenant: null, isHydrated: true });
      } else {
        set({ isHydrated: true });
      }
    }
  },
  isHydrated: false,
  signin: (payload, options) => {
    try {
      const cookieOptions = getCookieOptions(options?.expiresIn || payload.tokens.expires_at);
      Cookies.set("ACCESS_TOKEN", payload.tokens.access_token, cookieOptions);
      if (payload.tokens.refresh_token) {
        const refreshCookieOptions = {
          ...cookieOptions,
          expires: options?.remember ? 30 : 7,
        };
        Cookies.set("REFRESH_TOKEN", payload.tokens.refresh_token, refreshCookieOptions);
      }
      set({ user: payload.user, tenant: payload.tenant, isHydrated: true });
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("Sign in error:", error);
      throw new Error("Failed to sign in user");
    }
  },
  signout: (options) => {
    try {
      if (options?.soft) {
        set({ user: null, tenant: null });
        if (typeof window !== "undefined") {
          window.location.href = "/signin";
        }
        return;
      }
      Cookies.remove("ACCESS_TOKEN", { path: "/" });
      Cookies.remove("REFRESH_TOKEN", { path: "/" });
      if (typeof window !== "undefined") {
        localStorage.removeItem("USER_STORE");
        const currentPath = window.location.pathname;
        const redirectUrl = options?.redirectUrl || "/signin";
        if (!currentPath.includes("/signin") && !currentPath.includes("/signup")) {
          window.location.href = redirectUrl;
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("Sign out error:", error);
      Cookies.remove("ACCESS_TOKEN", { path: "/" });
      Cookies.remove("REFRESH_TOKEN", { path: "/" });
      if (typeof window !== "undefined") {
        localStorage.removeItem("USER_STORE");
      }
    }
  },
  update: (user) => set({ user }),
}));
