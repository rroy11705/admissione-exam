import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faGraduationCap, faMap, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Divider, Grid, Group, Pagination, Title } from '@mantine/core';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import { useStudentLeads } from '../../../apis/queries/studentLeads.queries';
import AppLayout from '../../../components/layouts/AppLayout';
import { NextPageWithLayout } from '../../../types';
import { withAuth } from '../../../utils/authentication';

const StudentsLeads: NextPageWithLayout = () => {
  const [page, setPage] = React.useState(1);

  const students = useStudentLeads(page);

  return (
    <main>
      <Head>
        <title>Students Leads</title>
        <meta name="description" content="StudentsLeads" />
      </Head>

      <Title order={3} className="">
        Students Leads
      </Title>
      <Divider mb="lg" />

      <Group position="right" mb="md">
        <div>
          <p>Total: {students.data?.pagination.totalDocs}</p>
        </div>
        <Pagination
          total={students.data?.pagination?.totalPages ?? 0}
          initialPage={1}
          page={students.data?.pagination?.page ?? 1}
          onChange={setPage}
        />
      </Group>

      {students.data?.students.map(student => (
        <Card shadow="sm" p="lg" mb="md" key={student._id}>
          <Group>
            <Title order={5} className="">
              {student.fullName}
            </Title>
          </Group>
          <Divider mb="md" />
          <Grid mb="md">
            <Grid.Col md={6} lg={3} className="flex items-center">
              <Group>
                <FontAwesomeIcon icon={faEnvelope} />
                <div>
                  <small className="block text-gray-500 text-xs">Email</small>
                  <span>{student.email}</span>
                </div>
              </Group>
            </Grid.Col>

            <Grid.Col md={6} lg={3} className="flex items-center">
              <Group>
                <FontAwesomeIcon icon={faPhone} />
                <div>
                  <small className="block text-gray-500 text-xs">Public Contact Number</small>
                  <span>
                    {student.contactNumber?.countryCode} {student.contactNumber?.number}
                  </span>
                </div>
              </Group>
            </Grid.Col>
            <Grid.Col md={6} lg={6}>
              <div className="flex items-center gap-4 mb-4">
                <FontAwesomeIcon icon={faMap} />

                <div className="flex-grow">
                  <small className="block text-gray-500 text-sm">Address</small>

                  <Grid>
                    <Grid.Col md={6} lg={6}>
                      <small className="block text-gray-500 text-sm">City</small>
                      <span className="block">{student.city}</span>
                    </Grid.Col>

                    <Grid.Col md={6} lg={6}>
                      <small className="block text-gray-500 text-sm">State</small>
                      <span className="block">{student.state}</span>
                    </Grid.Col>
                  </Grid>
                </div>
              </div>
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col md={6} lg={12}>
              <div className="flex items-center gap-4 mb-4">
                <FontAwesomeIcon icon={faGraduationCap} />

                <div className="flex-grow">
                  <small className="block text-gray-500 text-sm">Institution Details</small>

                  <Grid>
                    <Grid.Col md={6} lg={3}>
                      <small className="block text-gray-500 text-sm">Name</small>
                      <span className="block">{student.institution}</span>
                    </Grid.Col>

                    <Grid.Col md={6} lg={3}>
                      <small className="block text-gray-500 text-sm">College Email</small>
                      <span className="block">{student.collegeEmail}</span>
                    </Grid.Col>
                    <Grid.Col md={6} lg={3}>
                      <small className="block text-gray-500 text-sm">Academic Session</small>
                      <span className="block">
                        {student.academicSession?.startYear} - {student.academicSession?.endYear}
                      </span>
                    </Grid.Col>
                  </Grid>
                </div>
              </div>
            </Grid.Col>
          </Grid>
        </Card>
      ))}

      <Group position="right" mb="md">
        <div>
          <p>Total: {students.data?.pagination.totalDocs}</p>
        </div>
        <Pagination
          total={students.data?.pagination?.totalPages ?? 0}
          initialPage={1}
          page={students.data?.pagination?.page ?? 1}
          onChange={setPage}
        />
      </Group>
    </main>
  );
};

StudentsLeads.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = withAuth(async context => ({
  props: {
    user: context.req.user,
  },
}));

export default StudentsLeads;
