import { haversineDistanceMeters } from "./distanceUtils";
import { getLatitude, getLongitude } from "./coordinateUtils";

export const NEAREST_STOP_GUIDE_THRESHOLD_METERS = 40;

export function shouldShowGuideToNearestStop(params: {
  isRouteModeActive: boolean;
  currentLocation?: { latitude: number; longitude: number } | null;
  nearestStop?: any | null;
  thresholdMeters?: number;
}): boolean {
  const {
    isRouteModeActive,
    currentLocation,
    nearestStop,
    thresholdMeters = NEAREST_STOP_GUIDE_THRESHOLD_METERS,
  } = params;

  if (!isRouteModeActive) return false;
  if (!currentLocation) return false;
  if (!nearestStop) return false;

  const stopLat = getLatitude(nearestStop);
  const stopLon = getLongitude(nearestStop);

  if (!Number.isFinite(stopLat) || !Number.isFinite(stopLon)) return false;

  const distance = haversineDistanceMeters(
    currentLocation.latitude,
    currentLocation.longitude,
    stopLat,
    stopLon
  );

  return distance > thresholdMeters;
}

export function getGuideToNearestStopCoordinates(params: {
  currentLocation: { latitude: number; longitude: number };
  nearestStop: any;
}): { latitude: number; longitude: number }[] {
  const stopLat = getLatitude(params.nearestStop);
  const stopLon = getLongitude(params.nearestStop);

  if (!Number.isFinite(stopLat) || !Number.isFinite(stopLon)) return [];

  return [
    {
      latitude: params.currentLocation.latitude,
      longitude: params.currentLocation.longitude,
    },
    {
      latitude: stopLat,
      longitude: stopLon,
    },
  ];
}
