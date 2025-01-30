import { apiClient } from "./client";
import { userProfileSchema, type UserProfile } from "../types/user";
import { AuthError } from "@/lib/types/errors";

export async function getUserProfile(): Promise<UserProfile> {
  try {
    const response = await apiClient.get<UserProfile>("/user/profile");
    return userProfileSchema.parse(response.data);
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError(401, "Unable to fetch user profile");
  }
}
