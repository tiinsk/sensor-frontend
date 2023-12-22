export type DeviceLocation = 'inside' | 'outside';

export interface LatestReadingResponse {
  battery: number;
  created_at: string;
  device: string;
  disabled: boolean;
  humidity: number | null;
  id: number;
  location_type: DeviceLocation;
  lux: number | null;
  max_temperature: number | null;
  min_temperature: number | null;
  name: string;
  pressure: number | null;
  temperature: number | null;
}
export interface ExtremeResponse {
  device: string;
  max_humidity_month?: number;
  max_pressure_month?: number;
  max_temperature_month?: number;
  min_humidity_month?: number;
  min_pressure_month?: number;
  min_temperature_month?: number;
  max_humidity_week?: number;
  max_pressure_week?: number;
  max_temperature_week?: number;
  min_humidity_week?: number;
  min_pressure_week?: number;
  min_temperature_week?: number;
}

export interface DeviceResponse {
  disabled: boolean;
  id: string;
  location_type: DeviceLocation;
  name: string;
  order: number;
}

export interface ArrayResponse<DataType> {
  count: number;
  limit: number;
  values: DataType[];
}
