import { StopResponse } from "../types/stop";
import { NearestStop } from "../types/nearestStop";
import { haversineDistanceMeters } from "./distanceUtils";
import { getLatitude, getLongitude } from "./coordinateUtils";

export function getNearestStopsFromList(
  stops: StopResponse[],
  userLat: number,
  userLon: number,
  limit: number = 2
): NearestStop[] {
  return stops
    .map((stop) => {
      const lat = getLatitude(stop);
      const lon = getLongitude(stop);

      return {
        stop_id: stop.stop_id,
        name: stop.name || "Parada sin nombre",
        street_name: stop.name || null,
        lat,
        lon,
        sequence: stop.sequence,
        distance_meters: haversineDistanceMeters(userLat, userLon, lat, lon),
      };
    })
    .filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lon))
    .sort((a, b) => a.distance_meters - b.distance_meters)
    .slice(0, limit);
}
