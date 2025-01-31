import { Redirect } from "expo-router";
import useAuthStore from "@/store/auth";

export default function Index() {
  return <Redirect href={"/(auth)/signin"} />;
}
