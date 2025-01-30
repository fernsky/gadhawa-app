import { z } from "zod";
import { env } from "@/env";
import {
  authResponseSchema,
  type ApiError,
  type AuthResponse,
} from "@/lib/types/auth";
import { apiClient } from "./client";
import { AuthError } from "@/lib/types/errors";
import axios from "axios";

export const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    name: z.string().min(2, "Name must be at least 2 characters"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;

export { AuthError }; // Re-export for convenience

export async function signup(data: SignupInput): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/signup", {
      email: data.email,
      password: data.password,
      name: data.name,
    });

    return authResponseSchema.parse(response.data);
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    if (error instanceof z.ZodError) {
      throw new AuthError(500, "Invalid response from server");
    }
    throw new AuthError(500, "Something went wrong");
  }
}

export async function signin(data: SigninInput): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return authResponseSchema.parse(response.data);
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    if (error instanceof z.ZodError) {
      throw new AuthError(500, "Invalid response from server");
    }
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new AuthError(401, "Invalid email or password");
      }
      throw new AuthError(
        error.response?.status || 500,
        error.response?.data?.message || "Something went wrong"
      );
    }
    throw new AuthError(500, "Something went wrong");
  }
}

export async function signout(): Promise<void> {
  await apiClient.post("/auth/signout");
}
