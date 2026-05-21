export interface RouteCoordinate {
  lat: number;
  lon: number;
}

export interface WalkingRouteResponse {
  origin: RouteCoordinate;
  destination: RouteCoordinate;
  distance_meters?: number | null;
  duration_seconds?: number | null;
  geometry: RouteCoordinate[];
  provider: string;
}
