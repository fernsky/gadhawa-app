import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string().url(),
  API_VERSION: z.string(),
});

export const env = envSchema.parse({
  API_URL: "https://xc0wgs8wkk88kggosos0oco4.intensivestudy.com.np",
  API_VERSION: "v1",
});
