import apiClient from "./client";
import { Pattern } from "../types/pattern";
import { NearestStopsResponse } from "../types/nearestStop";
import { ShapeResponse } from "../types/shape";
import { StopResponse } from "../types/stop";

export async function fetchPatterns(
  routeId: string
): Promise<Pattern[]> {
  const response = await apiClient.get<Pattern[]>(
    `/routes/${routeId}/patterns`
  );
  return response.data;
}

export async function fetchShape(
  patternId: string
): Promise<ShapeResponse> {
  const response = await apiClient.get<ShapeResponse>(
    `/patterns/${patternId}/shape`
  );
  return response.data;
}

export async function fetchStops(
  patternId: string
): Promise<StopResponse[]> {
  const response = await apiClient.get<StopResponse[]>(
    `/patterns/${patternId}/stops`
  );
  return response.data;
}

export async function getNearestStops(
  patternId: string,
  lat: number,
  lon: number,
  limit: number = 2
): Promise<NearestStopsResponse> {
  const response = await apiClient.get<NearestStopsResponse>(
    `/patterns/${encodeURIComponent(patternId)}/nearest-stops`,
    { params: { lat, lon, limit } }
  );
  return response.data;
}
