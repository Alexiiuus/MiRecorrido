export interface StopResponse {
  stop_id: string;
  name: string;
  lat: number;
  lon: number;
  sequence: number;
  arrival_time: string | null;
  departure_time: string | null;
}

export interface StopTimeResponse {
  route_id: string;
  route_short_name: string;
  trip_id: string;
  headsign: string | null;
  arrival_time: string;
}
