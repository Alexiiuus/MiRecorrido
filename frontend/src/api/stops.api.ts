import apiClient from "./client";
import { StopTimeResponse } from "../types/stop";

export async function fetchStopTimes(
  stopId: string,
  params?: {
    date?: string;
    from_time?: string;
    limit?: number;
  }
): Promise<StopTimeResponse[]> {
  const response = await apiClient.get<StopTimeResponse[]>(
    `/stops/${stopId}/times`,
    { params }
  );
  return response.data;
}
