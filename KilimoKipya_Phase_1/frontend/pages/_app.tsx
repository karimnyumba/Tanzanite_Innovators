
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { theme } from '../theme';
import '../public/loader.css'
import { AuthProvider } from '@/context/Authentication';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/dates/styles.css';
import '../public/main.css'
import { useState } from 'react';




export default function App({ Component, pageProps }: AppProps) {


  return (
    <MantineProvider theme={theme} forceColorScheme='light'>
       <Notifications />
      <AuthProvider >
      <Head>
        <title>Crop Recommendation System</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width,height=device-height, user-scalable=no"
        />
        <link rel="shortcut icon" href="location_icons/marker-icon.png" />
      </Head>
      <Component {...pageProps} />
      </AuthProvider>
    </MantineProvider>
  );
}
