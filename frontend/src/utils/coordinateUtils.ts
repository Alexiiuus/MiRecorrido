export function getLatitude(item: any): number {
  return Number(
    item.lat ??
    item.latitude ??
    item.stop_lat ??
    item.shape_pt_lat ??
    0
  );
}

export function getLongitude(item: any): number {
  return Number(
    item.lon ??
    item.lng ??
    item.longitude ??
    item.stop_lon ??
    item.shape_pt_lon ??
    0
  );
}

export function isValidCoordinate(lat: number, lon: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lon) && lat !== 0 && lon !== 0;
}
