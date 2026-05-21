export interface ShapePoint {
  lat: number;
  lon: number;
  sequence: number;
}

export interface ShapeResponse {
  shape_id: string;
  points: ShapePoint[];
}
