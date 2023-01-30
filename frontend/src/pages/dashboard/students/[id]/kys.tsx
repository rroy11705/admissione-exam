import { Button, Card, Divider, Grid, Title } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { useStudent } from '../../../../apis/queries/students.queries';
import AppLayout from '../../../../components/layouts/AppLayout';
import { IKYSDetails, NextPageWithLayout } from '../../../../types';
import { withAuth } from '../../../../utils/authentication';
import { normalizeName } from '../../../../utils';
import {
  useStudentKYSDetails,
  useUpdateStudentVerificationStatus,
  useVerifyStudent,
} from '../../../../apis/queries/kys.queries';
import ImageModalButton from '../../../../components/core/ImageModalButton';
import VideoModalButton from '../../../../components/core/VideoModalButton';
import AadhaarUpdateForm from '../../../../components/kys/AadhaarUpdateForm';
import CollegeIDUpdateForm from '../../../../components/kys/CollegeIDUpdateForm';
import RegistrationCertificateUpdateForm from '../../../../components/kys/RegistrationCertificateUpdateForm';
import KYSRejectionForm from '../../../../components/kys/KYSRejectionForm';
import KYSRejectionLog from '../../../../components/kys/KYSRejectionLog';

const KYSPage: NextPageWithLayout = () => {
  const router = useRouter();

  const studentId = router.query.id as string;

  const student = useStudent(studentId);
  const kys = useStudentKYSDetails(studentId);

  const changeVerificationStatus = useUpdateStudentVerificationStatus(studentId);
  const markAsVerified = useVerifyStudent();

  const handleChangeVerificationStatus = (key: keyof IKYSDetails['verificationStatus']) => {
    if (kys.data) {
      changeVerificationStatus.mutate({
        ...kys.data?.verificationStatus,
        [key]: true,
      });
    }
  };

  const verify = () => {
    markAsVerified.mutate(studentId);
  };

  return (
    <main>
      <Head>
        <title>KYS Details</title>
      </Head>

      <Title>KYS Details</Title>

      <Divider />

      <Card>
        <p>
          Student:{' '}
          <strong>
            {normalizeName({
              firstName: student.data?.firstName,
              middleName: student.data?.middleName,
              lastName: student.data?.lastName,
            })}
          </strong>
        </p>

        <p>
          Sconto ID: <strong>{student.data?.scontoId}</strong>
        </p>

        <p>
          Email ID: <strong>{student.data?.email}</strong>
        </p>

        <Button fullWidth mt="lg" onClick={verify} loading={markAsVerified.isLoading}>
          <FontAwesomeIcon icon={faCheckCircle} className="mr-3" />
          Mark Student as Verified
        </Button>

        <Divider my="lg" />

        <Title order={4}>
          Aadhaar{' '}
          {kys.data?.verificationStatus.isAadhaarVerified ? (
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
          ) : (
            <FontAwesomeIcon icon={faCircleXmark} className="text-red-600" />
          )}
        </Title>

        <Grid>
          <Grid.Col span={6}>
            <p>
              Aadhaar Number: <strong>{kys.data?.aadhaarNumber}</strong>
            </p>

            <p>
              Aadhaar Card:{' '}
              <ImageModalButton src={kys.data?.aadhaarDocument}>
                <span className="mr-3">Open Link </span>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </ImageModalButton>
            </p>

            <Button
              mt="lg"
              color="green"
              type="button"
              loading={changeVerificationStatus.isLoading}
              onClick={() => handleChangeVerificationStatus('isAadhaarVerified')}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              Mark Aadhaar as Verified
            </Button>
          </Grid.Col>
          <Grid.Col span={6}>
            <AadhaarUpdateForm studentId={studentId} kys={kys.data} />
          </Grid.Col>
        </Grid>

        <Divider my="lg" />

        <Title order={4}>
          College ID Card{' '}
          {kys.data?.verificationStatus.isCollegeIdCardVerified ? (
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
          ) : (
            <FontAwesomeIcon icon={faCircleXmark} className="text-red-600" />
          )}
        </Title>

        <Grid>
          <Grid.Col span={6}>
            <p>
              College ID Number: <strong>{kys.data?.collegeIdCardNumber}</strong>
            </p>

            <p>
              College ID:{' '}
              <ImageModalButton src={kys.data?.collegeIdCardDocument}>
                <span className="mr-3">Open Link </span>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </ImageModalButton>
            </p>

            <Button
              mt="lg"
              color="green"
              type="button"
              loading={changeVerificationStatus.isLoading}
              onClick={() => handleChangeVerificationStatus('isCollegeIdCardVerified')}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              Mark College ID Card as Verified
            </Button>
          </Grid.Col>
          <Grid.Col span={6}>
            <CollegeIDUpdateForm studentId={studentId} kys={kys.data} />
          </Grid.Col>
        </Grid>

        {kys.data?.registrationCertificateNumber ? (
          <>
            <Divider my="lg" />

            <Title order={4}>
              Registration Certificate{' '}
              {kys.data?.verificationStatus.isRegistrationCertificateVerified ? (
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
              ) : (
                <FontAwesomeIcon icon={faCircleXmark} className="text-red-600" />
              )}
            </Title>

            <Grid>
              <Grid.Col span={6}>
                <p>
                  Registration Certificate Number:{' '}
                  <strong>{kys.data?.registrationCertificateNumber}</strong>
                </p>

                <p>
                  Registration Certificate:{' '}
                  <ImageModalButton src={kys.data?.collegeIdCardDocument}>
                    <span className="mr-3">Open Link </span>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </ImageModalButton>
                </p>

                <Button
                  mt="lg"
                  color="green"
                  type="button"
                  loading={changeVerificationStatus.isLoading}
                  onClick={() =>
                    handleChangeVerificationStatus('isRegistrationCertificateVerified')
                  }
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                  Mark Registration Certificate as Verified
                </Button>
              </Grid.Col>
              <Grid.Col span={6}>
                <RegistrationCertificateUpdateForm studentId={studentId} kys={kys.data} />
              </Grid.Col>
            </Grid>
          </>
        ) : null}

        <Divider my="lg" />

        <Title order={4}>
          KYS Video{' '}
          {kys.data?.verificationStatus.isVideoKYSDocumentVerified ? (
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
          ) : (
            <FontAwesomeIcon icon={faCircleXmark} className="text-red-600" />
          )}
        </Title>

        <Grid>
          <Grid.Col span={6}>
            <p>
              KYS Video Transcript: <strong>{kys.data?.videoKYSTranscript}</strong>
            </p>

            <p>
              Video:{' '}
              <VideoModalButton src={kys.data?.videoKYSDocument}>
                <span className="mr-3">Open Link </span>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </VideoModalButton>
            </p>

            <Button
              mt="lg"
              color="green"
              type="button"
              loading={changeVerificationStatus.isLoading}
              onClick={() => handleChangeVerificationStatus('isVideoKYSDocumentVerified')}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              Mark KYS Video as Verified
            </Button>
          </Grid.Col>
          <Grid.Col span={6} />
        </Grid>

        <Divider my="lg" />

        <Title order={4}>KYS Rejection Log</Title>

        <KYSRejectionForm studentId={studentId} />

        {kys.data?.verificationRejectionLogs?.map(log => (
          <KYSRejectionLog key={log._id} log={log} studentId={studentId} />
        ))}
      </Card>
    </main>
  );
};

KYSPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = withAuth(async context => ({
  props: {
    user: context.req.user,
  },
}));

export default KYSPage;
