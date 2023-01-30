import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faBriefcase, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Divider, Grid, Group, Pagination, Title } from '@mantine/core';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import { useJobApplicants } from '../../../apis/queries/jobApplications.queries';
import AppLayout from '../../../components/layouts/AppLayout';
import { NextPageWithLayout } from '../../../types';
import { withAuth } from '../../../utils/authentication';

const JobApplications: NextPageWithLayout = () => {
  const [page, setPage] = React.useState(1);

  const jobApplications = useJobApplicants(page);

  return (
    <main>
      <Head>
        <title>Job Applications</title>
        <meta name="description" content="JobApplications" />
      </Head>

      <Title order={3} className="">
        Job Applications
      </Title>
      <Divider mb="lg" />

      <Group position="right" mb="md">
        <div>
          <p>Total: {jobApplications.data?.pagination.totalDocs}</p>
        </div>
        <Pagination
          total={jobApplications.data?.pagination?.totalPages ?? 0}
          initialPage={1}
          page={jobApplications.data?.pagination?.page ?? 1}
          onChange={setPage}
        />
      </Group>

      {jobApplications.data?.jobApplicants.map(jobApplication => (
        <Card shadow="sm" p="lg" mb="md" key={jobApplication._id}>
          <Group>
            <Title order={5}>{jobApplication.name}</Title>
          </Group>
          <Divider mb="md" />
          <Grid mb="md">
            <Grid.Col md={6} lg={3}>
              <Group>
                <FontAwesomeIcon icon={faEnvelope} />
                <div>
                  <small className="block text-gray-500 text-xs">Email</small>
                  <span>{jobApplication.email}</span>
                </div>
              </Group>
            </Grid.Col>

            <Grid.Col md={6} lg={3}>
              <Group>
                <FontAwesomeIcon icon={faPhone} />
                <div>
                  <small className="block text-gray-500 text-xs">Public Contact Number</small>
                  <span>
                    {jobApplication.phoneNumber?.countryCode} {jobApplication.phoneNumber?.number}
                  </span>
                </div>
              </Group>
            </Grid.Col>
            <Grid.Col md={6} lg={3} className="flex items-center">
              <Group>
                <FontAwesomeIcon icon={faBriefcase} />
                <div>
                  <small className="block text-gray-500 text-xs">Role</small>
                  <span>{jobApplication.role}</span>
                </div>
              </Group>
            </Grid.Col>
          </Grid>
        </Card>
      ))}

      <Group position="right" mb="md">
        <div>
          <p>Total: {jobApplications.data?.pagination.totalDocs}</p>
        </div>
        <Pagination
          total={jobApplications.data?.pagination?.totalPages ?? 0}
          initialPage={1}
          page={jobApplications.data?.pagination?.page ?? 1}
          onChange={setPage}
        />
      </Group>
    </main>
  );
};

JobApplications.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = withAuth(async context => ({
  props: {
    user: context.req.user,
  },
}));

export default JobApplications;
