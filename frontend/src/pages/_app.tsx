import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css'; // import Font Awesome CSS
import {
  ColorScheme,
  ColorSchemeProvider,
  createEmotionCache,
  MantineProvider,
} from '@mantine/core';
import Head from 'next/head';
import React from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NotificationsProvider } from '@mantine/notifications';
import { config } from '@fortawesome/fontawesome-svg-core';
import { ModalsProvider } from '@mantine/modals';
import { AppPropsWithLayout } from '../types';
import { Provider, useCreateStore } from '../store';

config.autoAddCss = false;

const emotionCache = createEmotionCache({ key: 'mantine', prepend: false });

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const [queryClient] = React.useState(
    () => new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } }),
  );

  const [colorScheme, setColorScheme] = React.useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const getLayout = Component.getLayout || (page => page);

  const createStore = useCreateStore(pageProps.user);

  return (
    <>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#23538F" />
        <meta name="msapplication-TileColor" content="#23538F" />
        <meta name="theme-color" content="#23538F" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Provider createStore={createStore}>
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
              <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                  /** Put your mantine theme override here */
                  colorScheme: 'light',
                }}
                emotionCache={emotionCache} // Added to force load mantine after tailwindcss
              >
                <NotificationsProvider>
                  <ModalsProvider>{getLayout(<Component {...pageProps} />)}</ModalsProvider>
                </NotificationsProvider>
              </MantineProvider>
            </ColorSchemeProvider>
          </Provider>
          <ReactQueryDevtools position="bottom-right" />
        </Hydrate>
      </QueryClientProvider>
    </>
  );
};

export default App;
