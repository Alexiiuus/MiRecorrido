import apiClient from "./client";
import { WalkingRouteResponse } from "../types/routing";

export async function getWalkingRoute(params: {
  fromLat: number;
  fromLon: number;
  toLat: number;
  toLon: number;
}): Promise<WalkingRouteResponse> {
  const response = await apiClient.get<WalkingRouteResponse>(
    "/routing/walking-route",
    {
      params: {
        from_lat: params.fromLat,
        from_lon: params.fromLon,
        to_lat: params.toLat,
        to_lon: params.toLon,
      },
    }
  );
  return response.data;
}
