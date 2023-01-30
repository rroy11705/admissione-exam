import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Button } from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';
import { ReactElement } from 'react';
import AppLayout from '../../components/layouts/AppLayout';
import { NextPageWithLayout } from '../../types';
import { withAuth } from '../../utils/authentication';

const Dashboard: NextPageWithLayout = () => (
  <div>
    <Head>
      <title>Dashboard | Sconto Admin</title>
      <meta name="description" content="Sconto Admin Dashboard" />
    </Head>
    <Alert icon={<FontAwesomeIcon icon={faInfo} />} title="NEW!" color="green">
      Onboard new merchants is now available!
      <Link href="/dashboard/merchant/onboard" passHref>
        <Button variant="subtle" color="green" component="a">
          Onboard NOW!
        </Button>
      </Link>
    </Alert>
  </div>
);

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = withAuth(async context => ({
  props: {
    user: context.req.user,
  },
}));

export default Dashboard;
