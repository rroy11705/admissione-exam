import { ReactElement } from 'react';
import Head from 'next/head';
import { Divider, Title } from '@mantine/core';
import { NextPageWithLayout } from '../../../types';
import { withAuth } from '../../../utils/authentication';
import AppLayout from '../../../components/layouts/AppLayout';
import AddInstitution from '../../../components/institution/AddInstitution';
import InstitutionTable from '../../../components/institution/InstitutionTable';

const Institutions: NextPageWithLayout = () => (
  <main>
    <Head>
      <title>Institutions</title>
      <meta name="description" content="Institutions" />
    </Head>

    <Title order={3} className="">
      Institutions
    </Title>
    <Divider mb="lg" />

    <AddInstitution />

    <InstitutionTable />
  </main>
);

Institutions.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = withAuth(async context => ({
  props: {
    user: context.req.user,
  },
}));

export default Institutions;
