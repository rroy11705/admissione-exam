import Head from 'next/head';
import React, { ReactElement, useCallback, useRef, useState } from 'react';
import { Button, Divider, Group, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { CSVLink } from 'react-csv';
import AppLayout from '../../../components/layouts/AppLayout';
import { ApiResponse, ISocialEvent, NextPageWithLayout } from '../../../types';
import parseCookies, { withAuth } from '../../../utils/authentication';
import http from '../../../apis/http';
import SocialEventCard from '../../../components/socialEvent/SocialEventCard';
import SocialEventTransactionsTable from '../../../components/socialEvent/SocialEventTransactionsTable';
import { useSocialEventTransactions } from '../../../apis/queries/socialEvents.queries';
import { normalizeContact, normalizeName } from '../../../utils';

type PageProps = NextPageWithLayout<{ socialEvent: ISocialEvent }>;

type TransactionCSVData = {
  studentName: string;
  scontoId: string;
  studentEmail: string;
  studentContact: string;
  transactionId: string;
};

const SocialEvents: PageProps = ({ socialEvent }) => {
  const [csvData, setCSVData] = useState<Array<TransactionCSVData>>([
    {
      studentName: '',
      scontoId: '',
      studentEmail: '',
      studentContact: '',
      transactionId: '',
    },
  ]);
  const csvLinkEl = useRef<CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }>(null);
  const router = useRouter();
  const transactions = useSocialEventTransactions(
    router.query.id as string,
    undefined,
    undefined,
    true,
  );
  console.log(transactions.data?.socialEventTransaction);
  const headers = [
    { label: 'Student Name', key: 'studentName' },
    { label: 'Sconto Id', key: 'scontoId' },
    { label: 'Student Email', key: 'studentEmail' },
    { label: 'Student Contact', key: 'studentContact' },
    { label: 'Transaction Id', key: 'transactionId' },
  ];

  const downloadReport = useCallback(async () => {
    const data = await transactions.data?.socialEventTransaction?.map<TransactionCSVData>(
      transaction => ({
        studentName: normalizeName(transaction.student) || '',
        scontoId: transaction.student.scontoId || '',
        studentEmail: transaction.student.email || '',
        studentContact: normalizeContact(transaction.student.contactNumber) || '',
        transactionId: transaction.transactionId || '',
      }),
    );
    if (data && data.length > 0) setCSVData(data);
    setTimeout(() => {
      csvLinkEl.current?.link?.click();
    });
  }, [transactions]);

  return (
    <main>
      <Head>
        <title>{socialEvent.name} | Social Events</title>
        <meta name="description" content="Social Events" />
      </Head>

      <SocialEventCard socialEvent={socialEvent} />

      <Divider mb="lg" />

      <Group position="apart" align="center">
        <Title order={4} className="">
          Transactions
        </Title>
        <span>
          <Button onClick={downloadReport}>Export to CSV</Button>
          <CSVLink
            headers={headers}
            filename={`${
              transactions.data?.socialEventTransaction &&
              transactions.data?.socialEventTransaction.length > 0
                ? transactions.data?.socialEventTransaction[0].event.name
                : 'transactions'
            }.csv`}
            data={csvData}
            ref={csvLinkEl}
          />
        </span>
      </Group>

      <SocialEventTransactionsTable />
    </main>
  );
};

SocialEvents.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = withAuth(async context => {
  try {
    const cookies = parseCookies(context.req);

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${cookies.token}`);

    const result = await http.get<ApiResponse<{ socialEvent: ISocialEvent }>>(
      `/api/social-events/${String(context.params?.id)}`,
      { headers },
    );

    return {
      props: {
        user: context.req.user,
        socialEvent: result.data.socialEvent,
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

export default SocialEvents;
