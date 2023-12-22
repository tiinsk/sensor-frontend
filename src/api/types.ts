export interface ArrayResponse<DataType> {
  count: number;
  limit: number;
  values: DataType[];
}

export type PostResponse<DataType> =
  | {
      data: DataType;
      error: undefined;
    }
  | {
      data: undefined;
      error: { statusCode: number; message: string };
    };

export type DeviceLocation = 'inside' | 'outside';
export type Sensor = 'humidity' | 'temperature' | 'pressure';

export interface LatestReadingResponse {
  id: number;
  name: string;
  location_type: DeviceLocation;
  sensor_info: Sensor[];
  reading: {
    temperature: number | null;
    humidity: number | null;
    pressure: number | null;
    created_at: string;
    battery: number;
  };
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
