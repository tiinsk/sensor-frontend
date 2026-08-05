import { useQuery } from '@tanstack/react-query';
import { TimeFrameOptions } from '../components/selectors/time-frame-selector';
import { readingsQueries } from '../queries/readings-queries';

type LiveReadingsParams = {
  options: TimeFrameOptions;
  readingsReady?: boolean;
};

const isLivePeriod = (options: TimeFrameOptions) => options.offsetFromNow === 0;

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
