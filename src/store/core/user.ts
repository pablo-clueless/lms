import Cookies from "js-cookie";

import type { Maybe, SigninResponse, User } from "@/types";
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
  update: (user: User) => void;
  user: Maybe<User>;
}

const initialState: UserStore = {
  hydrate: () => {},
  isHydrated: false,
  signin: () => {},
  signout: () => {},
  update: () => {},
  user: null,
};

export const useUserStore = createPersistMiddleware<UserStore>("USER_STORE", (set, get) => ({
  ...initialState,
  hydrate: () => {
    if (typeof window !== "undefined" && !get().isHydrated) {
      const token = Cookies.get("ACCESS_TOKEN");
      if (!token && get().user) {
        set({ user: null, isHydrated: true });
      } else {
        set({ isHydrated: true });
      }
    }
  },
  isHydrated: false,
  signin: (payload, options) => {
    try {
      const cookieOptions = {
        path: "/",
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        expires: options?.expiresIn || payload.tokens.expires_at || 30,
      };
      Cookies.set("ACCESS_TOKEN", payload.tokens.access_token, cookieOptions);
      set({ user: payload.user, isHydrated: true });
      if (options?.remember) {
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
      throw new Error("Failed to sign in user");
    }
  },
  signout: (options) => {
    try {
      if (options?.soft) {
        set({ user: null });
        return;
      }
      Cookies.remove("ACCESS_TOKEN");
      if (typeof window !== "undefined") {
        localStorage.removeItem("USER_STORE");
        window.location.href = options?.redirectUrl || "/signin";
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
      Cookies.remove("ACCESS_TOKEN");
      localStorage.removeItem("USER_STORE");
    }
  },
  update: (user) => set({ user }),
}));
