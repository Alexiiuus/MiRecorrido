export const ACCESS_ROUTE_THRESHOLD_METERS = 80;
export const ACCESS_ROUTE_MIN_REFRESH_DISTANCE_METERS = 20;
export const ACCESS_ROUTE_MIN_REFRESH_TIME_MS = 10000;

export function shouldShowAccessRoute(params: {
  distanceToNearestStopMeters: number | null;
  thresholdMeters?: number;
}): boolean {
  const threshold = params.thresholdMeters ?? ACCESS_ROUTE_THRESHOLD_METERS;

  if (params.distanceToNearestStopMeters == null) return false;

  return params.distanceToNearestStopMeters > threshold;
}
