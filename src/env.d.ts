export const requiredEnvVars = ["API_URL", "NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_WS_URL", "NODE_ENV"] as const;

type RequiredEnvVars = (typeof requiredEnvVars)[number];

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Record<RequiredEnvVars, string> {
      readonly API_URL: string;
      readonly NEXT_PUBLIC_API_URL: string;
      readonly NEXT_PUBLIC_WS_URL: string;
      readonly NODE_ENV: "development" | "production";
    }
  }
}

export {};
