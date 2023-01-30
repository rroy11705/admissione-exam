import Head from 'next/head';
import React, { ReactElement } from 'react';
import { Button, Group, Text, Title } from '@mantine/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppLayout from '../../../../components/layouts/AppLayout';
import { NextPageWithLayout } from '../../../../types';
import { withAuth } from '../../../../utils/authentication';
import SubjectsTable from '../../../../components/internalModules/SubjectsTable';
import AddUpdateSubject from '../../../../components/internalModules/AddUpdateSubject';

const Subjects: NextPageWithLayout = () => {
  const [addSubjectOpened, setAddSubjectOpened] = React.useState(false);

  return (
    <main>
      <Head>
        <title>Subjects</title>
        <meta name="description" content="Subjects" />
      </Head>

      <Group position="apart" align="center">
        <Title order={3} className="">
          Subjects
        </Title>
        <Button variant="light" onClick={() => setAddSubjectOpened(true)}>
          <FontAwesomeIcon icon={faPlus} />
          <Text ml="sm">Add New Subject</Text>
        </Button>
      </Group>

      <AddUpdateSubject opened={addSubjectOpened} onClose={() => setAddSubjectOpened(false)} />
      <SubjectsTable />
    </main>
  );
};

Subjects.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = withAuth(async context => ({
  props: {
    user: context.req.user,
  },
}));

export default Subjects;
