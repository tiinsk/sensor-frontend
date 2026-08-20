import { LocationType } from '../api/types';

export const getLocationTitle = (
  location: LocationType
): string | undefined => {
  switch (location) {
    case 'inside':
      return 'Inside Stats';
    case 'outside':
      return 'Outside Stats';
    default:
      return undefined;
  }
};
