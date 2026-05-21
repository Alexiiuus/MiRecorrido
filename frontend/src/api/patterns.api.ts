import apiClient from "./client";
import { Pattern } from "../types/pattern";
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
