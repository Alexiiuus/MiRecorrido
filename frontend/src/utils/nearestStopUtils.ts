import { StopResponse } from "../types/stop";
import { NearestStop } from "../types/nearestStop";
import { getLatitude, getLongitude } from "./coordinateUtils";
import { StopHighlightType } from "./stopUtils";

export function getStopId(stop: any): string {
  return String(
    stop.stop_id ??
    stop.id ??
    stop.stopId ??
    ""
  );
}

export function getNearestHighlightType(
  stop: StopResponse,
  nearestStops: NearestStop[]
): StopHighlightType {
  if (nearestStops.length === 0) return null;

  const stopId = getStopId(stop);

  const index = nearestStops.findIndex((nearest) => {
    const nearestId = getStopId(nearest);

    if (stopId && nearestId && stopId === nearestId) {
      return true;
    }

    const stopLat = getLatitude(stop);
    const stopLon = getLongitude(stop);
    const nearestLat = getLatitude(nearest);
    const nearestLon = getLongitude(nearest);

    return (
      Math.abs(stopLat - nearestLat) < 0.00001 &&
      Math.abs(stopLon - nearestLon) < 0.00001
    );
  });

  if (index === 0) return "nearest-1";
  if (index === 1) return "nearest-2";
  return null;
}
