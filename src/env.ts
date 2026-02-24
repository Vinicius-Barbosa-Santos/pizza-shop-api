import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  API_BASE_URL: z.string().min(1),
  AUTH_REDIRECT_URL: z.string().min(1),
  PORT: z.coerce.number().default(3000),
});

export const env = envSchema.parse(process.env);
