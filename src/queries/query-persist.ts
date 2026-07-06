import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import type { PersistQueryClientOptions } from '@tanstack/react-query-persist-client';
import { queryClient } from './query-client';

export const DEVICES_QUERY_CACHE_KEY = 'sensor-devices-query-cache';

export const isDeviceListQueryKey = (queryKey: readonly unknown[]) =>
  queryKey[0] === 'devices' && queryKey[1] === 'all';

export const devicesPersister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: DEVICES_QUERY_CACHE_KEY,
});

export const devicesPersistOptions: Omit<
  PersistQueryClientOptions,
  'queryClient'
> = {
  persister: devicesPersister,
  maxAge: 1000 * 60 * 60 * 24 * 7,
  dehydrateOptions: {
    shouldDehydrateQuery: query => isDeviceListQueryKey(query.queryKey),
  },
};

export const clearQueryCacheOnSignOut = () => {
  void devicesPersister.removeClient();
  queryClient.clear();
};
