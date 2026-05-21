import axios from "axios";
import { API_BASE_URL } from "../config/env";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.warn(`API error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.warn("API no response:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
