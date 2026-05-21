import apiClient from "./client";
import { Route } from "../types/route";

export async function fetchRoutes(): Promise<Route[]> {
  const response = await apiClient.get<Route[]>("/routes");
  return response.data;
}
