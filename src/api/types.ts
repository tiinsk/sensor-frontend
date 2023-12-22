import { ValueType } from '../components/selectors/time-frame-selector';

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
  id: string;
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

export interface ReadingValue {
  avg: number | null;
  min: number | null;
  max: number | null;
}

export interface Statistics {
  temperature: ReadingValue;
  humidity: ReadingValue;
  pressure: ReadingValue;
}

export interface StatisticsResponse {
  id: string;
  statistics: Statistics;
}

export interface DeviceResponse {
  id: string;
  location_type: DeviceLocation;
  name: string;
  order: number;
}

export interface Reading extends ReadingValue {
  time: string;
}

export interface ReadingsResponse {
  id: string;
  values: Reading[];
}

export interface DeviceReadingResponse {
  id: string;
  values: {
    type: ValueType;
    values: Reading[];
  }[];
}
