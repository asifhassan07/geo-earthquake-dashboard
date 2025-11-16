export interface Earthquake {
  id: string;
  place: string;
  mag: number;
  depth: number;
  latitude: number;
  longitude: number;
  time: number; // Unix timestamp (ms)
}
