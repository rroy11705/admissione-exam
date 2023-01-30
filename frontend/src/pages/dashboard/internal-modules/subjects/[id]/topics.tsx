import Head from 'next/head';
import React, { ReactElement } from 'react';
import { Button, Group, Text, Title } from '@mantine/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppLayout from '../../../../../components/layouts/AppLayout';
import { ITopics, NextPageWithLayout } from '../../../../../types';
import { withAuth } from '../../../../../utils/authentication';
import TopicsTable from '../../../../../components/internalModules/TopicsTable';
import AddUpdateTopic from '../../../../../components/internalModules/AddUpdateTopic';

type PageProps = NextPageWithLayout<{ subject_id: string; topics: ITopics }>;

const Topics: PageProps = ({ subject_id }) => {
  const [addSubjectOpened, setAddSubjectOpened] = React.useState(false);

  return (
    <main>
      <Head>
        <title>Topics</title>
        <meta name="description" content="Topics" />
      </Head>

      <Group position="apart" align="center">
        <Title order={3} className="">
          Topics
        </Title>
        <Button variant="light" onClick={() => setAddSubjectOpened(true)}>
          <FontAwesomeIcon icon={faPlus} />
          <Text ml="sm">Add New Topic</Text>
        </Button>
      </Group>

      <AddUpdateTopic
        subject_id={subject_id}
        opened={addSubjectOpened}
        onClose={() => setAddSubjectOpened(false)}
      />
      <TopicsTable subject_id={subject_id} />
    </main>
  );
};

Topics.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = withAuth(async context => {
  try {
    return {
      props: {
        user: context.req.user,
        subject_id: context.params?.id,
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

export default Topics;
