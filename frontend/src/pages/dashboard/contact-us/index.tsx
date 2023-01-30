import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Divider, Grid, Group, Pagination, Title } from '@mantine/core';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import { useSubscribers } from '../../../apis/queries/subscribers.queries';
import AppLayout from '../../../components/layouts/AppLayout';
import { NextPageWithLayout } from '../../../types';
import { withAuth } from '../../../utils/authentication';

const Subscribers: NextPageWithLayout = () => {
  const [page, setPage] = React.useState(1);

  const subscribers = useSubscribers(page);

  return (
    <main>
      <Head>
        <title>Contact Us</title>
        <meta name="description" content="Subscribers" />
      </Head>

      <Title order={3} className="">
        Contact Us
      </Title>
      <Divider mb="lg" />

      <Group position="right" mb="md">
        <div>
          <p>Total: {subscribers.data?.pagination.totalDocs}</p>
        </div>
        <Pagination
          total={subscribers.data?.pagination?.totalPages ?? 0}
          initialPage={1}
          page={subscribers.data?.pagination?.page ?? 1}
          onChange={setPage}
        />
      </Group>

      {subscribers.data?.contactus?.map(subscriber => (
        <Card shadow="sm" p="lg" mb="md" key={subscriber._id}>
          <Grid mb="md">
            <Grid.Col md={6} lg={3}>
              <Group>
                <FontAwesomeIcon icon={faEnvelope} />
                <div>
                  <small className="block text-gray-500 text-xs">Email</small>
                  <span>{subscriber.email}</span>
                </div>
              </Group>
            </Grid.Col>
          </Grid>
        </Card>
      ))}

      <Group position="right" mb="md">
        <div>
          <p>Total: {subscribers.data?.pagination.totalDocs}</p>
        </div>
        <Pagination
          total={subscribers.data?.pagination?.totalPages ?? 0}
          initialPage={1}
          page={subscribers.data?.pagination?.page ?? 1}
          onChange={setPage}
        />
      </Group>
    </main>
  );
};

Subscribers.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = withAuth(async context => ({
  props: {
    user: context.req.user,
  },
}));

export default Subscribers;
