import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export const TestQueryProvider = ({
  children,
  client = createTestQueryClient(),
}: PropsWithChildren<{ client?: QueryClient }>) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);
