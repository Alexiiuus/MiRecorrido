export interface Pattern {
  pattern_id: string;
  route_id: string;
  direction_id: number | null;
  headsign: string | null;
  shape_id: string | null;
  sample_trip_id: string;
}
