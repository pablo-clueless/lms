import { createPersistMiddleware } from "../middleware";

type Theme = "dark" | "light";

interface GlobalStore {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  setTheme: (theme: Theme) => void;
  theme: Theme;
}

const initialState: GlobalStore = {
  isCollapsed: false,
  setIsCollapsed: () => {},
  setTheme: () => {},
  theme: "light",
};

export const useGlobalStore = createPersistMiddleware<GlobalStore>("GLOBAL_STORE", (set) => ({
  ...initialState,
  setIsCollapsed: (isCollapsed) => set({ isCollapsed }),
  setTheme: (theme) => {
    if (typeof document !== "undefined") {
      document.body.classList.toggle("dark", theme === "dark");
      set({ theme });
    }
  },
}));
