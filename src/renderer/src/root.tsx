import { App, ConfigProvider, theme as antdTheme } from 'antd';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { JSX } from 'react/jsx-runtime';
import { themeAtom, useThemeToken } from './hooks/theme';
import { useAtom } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ipcLink } from 'electron-trpc/renderer';
import { trpc } from '@renderer/trpc';

const Root = (): JSX.Element => {
  const [theme] = useAtom(themeAtom);
  const themeToken = useThemeToken();

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [ipcLink()]
    })
  );

  return (
    <ConfigProvider
      theme={{
        token: themeToken,
        algorithm: theme == 'light' ? antdTheme.defaultAlgorithm : antdTheme.darkAlgorithm
      }}
    >
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <App>
            <RouterProvider router={router} />
          </App>
        </QueryClientProvider>
      </trpc.Provider>
    </ConfigProvider>
  );
};

export default Root;
