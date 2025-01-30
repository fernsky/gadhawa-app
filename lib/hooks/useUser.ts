import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/api/user";
import * as SecureStore from "expo-secure-store";
import { queryClient } from "@/lib/query/client";
import { toast } from "@/lib/toast";

export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}
