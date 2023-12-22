import {
  ArrayResponse,
  DeviceResponse,
  ExtremeResponse,
  LatestReadingResponse,
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
  getAllDeviceExtremes: (deviceId: string) =>
    api.get<ExtremeResponse>({
      route: `/devices/${deviceId}/readings/extremes?localTimeZone=${getTimeZone()}`,
    }),
};

export default routes;
