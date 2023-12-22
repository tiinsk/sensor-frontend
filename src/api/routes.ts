import {
  ArrayResponse,
  DeviceResponse,
  LatestReadingResponse,
  StatisticsResponse,
} from './types';
import * as api from './index';
const { DateTime } = require('luxon');

const getTimeZone = () => {
  return DateTime.fromJSDate(new Date()).get('offset') / 60;
};

const routes = {
  login: (payload: { username: string; password: string }) =>
    api.post<string>({ route: '/login', payload }, false),
  getAllLatest: () =>
    api.get<ArrayResponse<LatestReadingResponse>>({
      route: `/devices/latest-readings`,
    }),
  getExtremes: () =>
    api.get({ route: `/readings/extremes?localTimeZone=${getTimeZone()}` }),
  getAllStatistics: ({
    startTime,
    endTime,
  }: {
    startTime: string;
    endTime: string;
  }) =>
    api.get<ArrayResponse<StatisticsResponse>>({
      route: `/devices/statistics?startTime=${startTime}&endTime=${endTime}`,
    }),
  getAllReadings: (deviceId: string, params: any) =>
    api.get({
      route: `/devices/${deviceId}/readings`,
      params,
    }),
  getAllDevices: () =>
    api.get<ArrayResponse<DeviceResponse>>({ route: '/devices' }),
  getDeviceLatestReadings: (deviceId: string) =>
    api.get<LatestReadingResponse>({
      route: `/devices/${deviceId}/latest-readings`,
    }),
  getAllDeviceStatistics: ({
    startTime,
    endTime,
    deviceId,
  }: {
    startTime: string;
    endTime: string;
    deviceId: string;
  }) =>
    api.get<StatisticsResponse>({
      route: `/devices/${deviceId}/statistics?startTime=${startTime}&endTime=${endTime}`,
    }),
};

export default routes;
