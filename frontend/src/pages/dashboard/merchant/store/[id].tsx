import React, { ReactElement } from 'react';
import Head from 'next/head';
import { Button, Card, Divider, Group, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NextPageWithLayout } from '../../../../types';
import AppLayout from '../../../../components/layouts/AppLayout';
import { useMerchantStore } from '../../../../apis/queries/merchantStoreLocation.queries';
import MerchantStoreCard from '../../../../components/merchant/MerchantStoreCard';
import AddMerchantStaff from '../../../../components/merchant/AddMerchantStaff';
import StoreStaffTable from '../../../../components/merchant/StoreStaffTable';

const MerchantStorePage: NextPageWithLayout = () => {
  const router = useRouter();
  const store = useMerchantStore(router.query.id as string);
  const [opened, setOpened] = React.useState(false);

  console.log(store.data);

  return (
    <main>
      <Head>
        <title>Merchant Store Location</title>
        <meta name="description" content="Merchants Store Location" />
      </Head>

      <Title order={3} className="">
        Merchants Store
      </Title>
      <Divider mb="lg" />

      {store.data ? <MerchantStoreCard store={store.data} /> : null}

      <Divider mb="lg" />

      <Group position="apart" align="center">
        <Text>Merchant Staff</Text>
        <Button variant="light" onClick={() => setOpened(true)}>
          <FontAwesomeIcon icon={faPlus} />
          <Text ml="sm">Add New Staff</Text>
        </Button>
      </Group>

      {store.data ? (
        <AddMerchantStaff
          storeId={store.data._id}
          name={store.data.name}
          opened={opened}
          onClose={() => setOpened(false)}
        />
      ) : null}

      <Card mt="md">{store.data ? <StoreStaffTable storeId={store.data._id} /> : null}</Card>
    </main>
  );
};

MerchantStorePage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default MerchantStorePage;
