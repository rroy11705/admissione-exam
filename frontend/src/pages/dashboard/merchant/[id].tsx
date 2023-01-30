import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Divider, Group, Text } from '@mantine/core';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import http from '../../../apis/http';
import AppLayout from '../../../components/layouts/AppLayout';
import AddMerchantStaff from '../../../components/merchant/AddMerchantStaff';
import AddMerchantStoreLocation from '../../../components/merchant/AddMerchantStoreLocation';
import MerchantCard from '../../../components/merchant/MerchantCard';
import MerchantStaffTable from '../../../components/merchant/MerchantStaffTable';
import MerchantStoreLocationTable from '../../../components/merchant/MerchantStoreLocationTable';
import { ApiResponse, IMerchant, NextPageWithLayout } from '../../../types';
import parseCookies, { withAuth } from '../../../utils/authentication';

type PageProps = NextPageWithLayout<{ merchant: IMerchant }>;

const Merchant: PageProps = ({ merchant }) => {
  const [addStoreLocationOpened, setAddStoreLocationOpened] = React.useState(false);
  const [addOwnerOpened, setAddOwnerOpened] = React.useState(false);

  return (
    <main>
      <Head>
        <title>Merchant</title>
      </Head>

      <MerchantCard merchant={merchant} />

      <Divider mb="lg" />

      <Group position="apart" align="center">
        <Text>Merchant Store Locations</Text>
        <Button variant="light" onClick={() => setAddStoreLocationOpened(true)}>
          <FontAwesomeIcon icon={faPlus} />
          <Text ml="sm">Add New Store Location</Text>
        </Button>
      </Group>

      <AddMerchantStoreLocation
        merchant={merchant}
        opened={addStoreLocationOpened}
        onClose={() => setAddStoreLocationOpened(false)}
      />

      <Card mt="md">
        <MerchantStoreLocationTable merchantId={merchant._id} />
      </Card>

      <Divider mb="lg" />

      <Group position="apart" align="center">
        <Text>Merchant Owner</Text>
        <Button variant="light" onClick={() => setAddOwnerOpened(true)}>
          <FontAwesomeIcon icon={faPlus} />
          <Text ml="sm">Add New Owner</Text>
        </Button>
      </Group>

      <AddMerchantStaff
        merchantId={merchant._id}
        name={merchant.name}
        opened={addOwnerOpened}
        onClose={() => setAddOwnerOpened(false)}
        owner
      />

      <Card mt="md">
        <MerchantStaffTable merchantId={merchant._id} />
      </Card>
    </main>
  );
};

Merchant.getLayout = function getLayout(page: ReactElement) {
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

export default Merchant;
