import { Divider, Title } from '@mantine/core';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import http from '../../../../apis/http';
import AppLayout from '../../../../components/layouts/AppLayout';
import UpdateMerchantForm from '../../../../components/merchant/UpdateMerchantForm';
import { ApiResponse, IMerchant, NextPageWithLayout } from '../../../../types';
import parseCookies, { withAuth } from '../../../../utils/authentication';

type PageProps = NextPageWithLayout<{ merchant: IMerchant }>;

const OnboardMerchant: PageProps = ({ merchant }) => (
  <main>
    <Head>
      <title>Edit Merchant</title>
      <meta name="description" content="Onboard merchant" />
    </Head>

    <Title order={3} className="">
      Edit Merchant
    </Title>
    <Divider mb="lg" />

    <UpdateMerchantForm merchant={merchant} />
  </main>
);

OnboardMerchant.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = withAuth(async context => {
  try {
    const cookies = parseCookies(context.req);

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${cookies.token}`);

    const result = await http.get<ApiResponse<{ merchant: IMerchant }>>(
      `/api/merchants/${String(context.params?.id)}`,
      { headers },
    );

    return {
      props: {
        user: context.req.user,
        merchant: result.data.merchant,
      },
    };
  } catch (err) {
    return {
      redirect: {
        permanent: true,
        destination: '/',
      },
      props: {},
    };
  }
});

export default OnboardMerchant;
