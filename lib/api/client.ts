import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { env } from "@/env";
import * as SecureStore from "expo-secure-store";
import { AuthError } from "@/lib/types/errors";

const apiClient = axios.create({
  baseURL: `${env.API_URL}/${env.API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorResponse = error.response?.data;
    throw new AuthError(
      error.response?.status || 500,
      errorResponse?.message || "Something went wrong",
      errorResponse?.errors
    );
  }
);

// Setup token refresh
const refreshAuthLogic = async (failedRequest: any) => {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  if (!refreshToken) throw new Error("No refresh token");

  try {
    const response = await axios.post(
      `${env.API_URL}/${env.API_VERSION}/auth/refresh`,
      {
        refresh_token: refreshToken,
      }
    );

    const { access_token } = response.data;
    await SecureStore.setItemAsync("token", access_token);

    failedRequest.response.config.headers.Authorization = `Bearer ${access_token}`;
    return Promise.resolve();
  } catch (error) {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("refreshToken");
    // Handle logout here
  }
};

createAuthRefreshInterceptor(apiClient, refreshAuthLogic);

export { apiClient };
