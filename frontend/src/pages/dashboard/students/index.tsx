import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import {
  faCalendar,
  faCheckCircle,
  faGraduationCap,
  faMap,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Divider, Grid, Group, Pagination, Title } from '@mantine/core';
import dayjs from 'dayjs';
import Head from 'next/head';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import { useStudents } from '../../../apis/queries/students.queries';
import AppLayout from '../../../components/layouts/AppLayout';
import { NextPageWithLayout } from '../../../types';
import { withAuth } from '../../../utils/authentication';

const StudentsLeads: NextPageWithLayout = () => {
  const [page, setPage] = React.useState(1);

  const students = useStudents(page);

  return (
    <main>
      <Head>
        <title>Students Leads</title>
        <meta name="description" content="Students" />
      </Head>

      <Title order={3} className="">
        Students
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
          <Group position="apart">
            <Title order={5}>
              {student.firstName} {student.middleName} {student.lastName}
            </Title>

            {student.isVerified ? (
              <div className="flex flex-row justify-items-start gap-2 items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                <span className="py-3 pr-3">Verified</span>
              </div>
            ) : null}
          </Group>
          <Divider mb="md" />
          <Grid mb="md">
            {/* <Grid.Col md={6} lg={2} className="flex items-center">
              <div className="h-full">
                <Image
                  src={
                    student.profilePicture
                  }
                  alt="profile picture"
                  height="100%"
                  width="100%"
                />
              </div>
            </Grid.Col> */}
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
                  <small className="block text-gray-500 text-xs">Contact Number</small>
                  <span>
                    {student.contactNumber?.countryCode} {student.contactNumber?.number}
                  </span>
                </div>
              </Group>
            </Grid.Col>
            <Grid.Col md={6} lg={3} className="flex items-center">
              <Group>
                <FontAwesomeIcon icon={faCalendar} />
                <div>
                  <small className="block text-gray-500 text-xs">Birth Date</small>
                  {student.dob ? (
                    <span>{dayjs(student.dob.toString()).format('DD / MM / YYYY')}</span>
                  ) : null}
                </div>
              </Group>
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col md={6} lg={12}>
              <div className="flex items-center gap-4 mb-4">
                <FontAwesomeIcon icon={faMap} />

                <div className="flex-grow">
                  <small className="block text-gray-500 text-sm">Address</small>
                  <span className="text-md">{student.address?.formattedAddress}</span>

                  <Grid>
                    <Grid.Col md={6} lg={3}>
                      <small className="block text-gray-500 text-sm">City</small>
                      <span className="block">{student.address?.city}</span>
                    </Grid.Col>

                    <Grid.Col md={6} lg={3}>
                      <small className="block text-gray-500 text-sm">State</small>
                      <span className="block">{student.address?.state}</span>
                    </Grid.Col>

                    <Grid.Col md={6} lg={6}>
                      <small className="block text-gray-500 text-sm">Coordinates</small>

                      {student.address?.coordinates ? (
                        <span className="block">
                          {student.address?.coordinates?.lat}, {student.address?.coordinates?.lng}
                        </span>
                      ) : (
                        <span className="block">-</span>
                      )}
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
                      <span className="block">
                        {student.institution ? student.institution.name : '-'}
                      </span>
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

          <Link href={`/dashboard/students/${student._id}/kys`} passHref>
            <Button component="a">View KYS Details</Button>
          </Link>
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
