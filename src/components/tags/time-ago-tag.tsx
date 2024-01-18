import { Tag } from '../styled/tag';
import { DateTime } from 'luxon';
import { getTimeAgoString } from '../../utils/datetime';

const ERROR_TIME_DIFF_MIN = 20;

interface TimeAgoTagProps {
  date?: string;
  isLoading?: boolean;
}

export const TimeAgoTag = ({ date, isLoading }: TimeAgoTagProps) => {
  const timeDiff = date
    ? Math.abs(DateTime.fromISO(date).diffNow('minutes').minutes)
    : 0;
  const tagVariant =
    !date || timeDiff > ERROR_TIME_DIFF_MIN ? 'error' : 'default';
  return (
    <Tag
      variant={date ? tagVariant : 'grey'}
      text={date ? getTimeAgoString(date) : 'No connections'}
      isLoading={isLoading}
    />
  );
};
