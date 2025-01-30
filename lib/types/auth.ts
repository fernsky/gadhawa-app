import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
});

export const authResponseSchema = z.object({
  access_token: z.string(),
  user: userSchema,
});

export type User = z.infer<typeof userSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;

export type ApiError = {
  code: number;
  message: string;
  errors?: Record<string, string[]>;
};
