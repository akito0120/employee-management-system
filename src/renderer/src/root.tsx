import './assets/index.css';
import './i18n';

import { trpc } from '@renderer/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App, ConfigProvider, theme as antdTheme } from 'antd';
import { ipcLink } from 'electron-trpc/renderer';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { JSX } from 'react/jsx-runtime';
import { RouterProvider } from 'react-router-dom';

import { themeAtom, useThemeToken } from './hooks/theme';
import router from './router';

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
