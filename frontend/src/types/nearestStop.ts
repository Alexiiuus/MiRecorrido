export interface NearestStop {
  stop_id: string;
  name: string;
  street_name?: string | null;
  lat: number;
  lon: number;
  sequence?: number | null;
  distance_meters: number;
}

export interface NearestStopsResponse {
  pattern_id: string;
  user_location: {
    lat: number;
    lon: number;
  };
  nearest_stops: NearestStop[];
}
