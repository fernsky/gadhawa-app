import axios from "axios";
import { env } from "@/env";
import useAuthStore from "@/store/auth";

const apiClient = axios.create({
  baseURL: `${env.API_URL}/${env.API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export { apiClient };
