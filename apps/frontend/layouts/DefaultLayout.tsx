import React, { ReactNode } from 'react';
import Head from 'next/head';
import { Container, Global } from '@mantine/core';
import HeadNav from '../components/head-nav/head-nav';

type Props = {
  children?: ReactNode;
  title?: string;
};

const DefaultLayout = ({ children, title = 'Fonbnk Wallet' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <Global
      styles={[
        {
          '@font-face': {
            fontFamily: 'ObjektivMk1 Regular',
            src: `url('/assets/fonts/ObjektivMk1-Regular.woff2') format("woff2")`,
            fontWeight: 700,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'ObjektivMk1 XBold',
            src: `url('/assets/fonts/ObjektivMk1-XBold.woff2') format("woff2")`,
            fontWeight: 900,
            fontStyle: 'normal',
          },
        },
      ]}
    />
    <HeadNav />
    <Container>{children}</Container>
  </div>
);

export default DefaultLayout;
