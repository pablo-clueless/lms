import * as Yup from "yup";

const envSchema = Yup.object({
  API_URL: Yup.string().required("API_URL is required").url("API_URL must be a valid URL"),
  NODE_ENV: Yup.string().oneOf(["development", "production"]),
});

const env = process.env;
const parsed = envSchema.validateSync(env);

if (!parsed) {
  throw new Error("Invalid environment variables");
}

export const envConfig = {
  ...parsed,
};
