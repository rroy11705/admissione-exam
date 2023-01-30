import Head from 'next/head';
import React, { ReactElement } from 'react';
import { Button, Group, Text, Title } from '@mantine/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppLayout from '../../../components/layouts/AppLayout';
import { NextPageWithLayout } from '../../../types';
import { withAuth } from '../../../utils/authentication';
import SocialEventTable from '../../../components/socialEvent/SocialEventTable';
import AddSocialEvent from '../../../components/socialEvent/AddSocialEvent';

const SocialEvents: NextPageWithLayout = () => {
  const [addSocialEventOpened, setAddSocialEventOpened] = React.useState(false);

  return (
    <main>
      <Head>
        <title>Social Events</title>
        <meta name="description" content="Social Events" />
      </Head>

      <Group position="apart" align="center">
        <Title order={3} className="">
          Social Events
        </Title>
        <Button variant="light" onClick={() => setAddSocialEventOpened(true)}>
          <FontAwesomeIcon icon={faPlus} />
          <Text ml="sm">Add New Store Location</Text>
        </Button>
      </Group>

      <AddSocialEvent
        opened={addSocialEventOpened}
        onClose={() => setAddSocialEventOpened(false)}
      />
      <SocialEventTable />
    </main>
  );
};

SocialEvents.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = withAuth(async context => ({
  props: {
    user: context.req.user,
  },
}));

export default SocialEvents;
