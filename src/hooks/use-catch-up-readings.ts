import { useQuery } from '@tanstack/react-query';
import { TimeFrameOptions } from '../components/selectors/time-frame-selector';
import { readingsQueries } from '../queries/readings-queries';

const isLivePeriod = (options: TimeFrameOptions) => options.offsetFromNow === 0;

type LiveReadingsParams = {
  options: TimeFrameOptions;
  readingsReady?: boolean;
};

export const useLiveReadingsSync = ({
  options,
  readingsReady = false,
}: LiveReadingsParams) => {
  useQuery({
    ...readingsQueries.catchUp(options),
    enabled:
      readingsReady && isLivePeriod(options) && options.valueType !== undefined,
  });
};

type DeviceLiveReadingsParams = LiveReadingsParams & {
  deviceId: string | undefined;
};

export const useDeviceLiveReadingsSync = ({
  deviceId,
  options,
  readingsReady = false,
}: DeviceLiveReadingsParams) => {
  useQuery({
    ...readingsQueries.deviceCatchUp(deviceId ?? '', options),
    enabled: Boolean(deviceId) && readingsReady && isLivePeriod(options),
  });
};
