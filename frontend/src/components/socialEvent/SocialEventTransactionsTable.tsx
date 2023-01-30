/* eslint-disable react/no-unstable-nested-components */
import {
  faEllipsisV,
  faCircleXmark,
  faCheckCircle,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ActionIcon,
  Box,
  Group,
  Image,
  Menu,
  Pagination,
  Progress,
  Table,
  Text,
} from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/router';
import React from 'react';
import {
  useSocialEventTransactions,
  useToggleSocialEventTransactionActive,
} from '../../apis/queries/socialEvents.queries';
import { ISocialEventTransaction } from '../../types';
import { downloadImage, normalizeName } from '../../utils';

const columnHelper = createColumnHelper<ISocialEventTransaction>();

const Actions: React.FC<CellContext<ISocialEventTransaction, unknown>> = ({ row }) => {
  const toggleActive = useToggleSocialEventTransactionActive();
  const handleActivate = () => {
    openConfirmModal({
      title: 'Are you sure you want to validate this transaction?',
      children: (
        <Text size="sm">Marking this transaction as valid will make this transaction valid.</Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => {},
      onConfirm: () =>
        toggleActive.mutate({
          transactionId: row.original._id,
          isValid: !row.original.isTransactionValid,
        }),
    });
  };

  const handleShowTransactionDetails = () => {
    openConfirmModal({
      title: `Transaction details for ${row.original.transactionId}.`,
      children: (
        <Box>
          <Image
            src={row.original.transactionProof?.path}
            alt={row.original.transactionId}
            height={500}
          />
        </Box>
      ),
      labels: { confirm: 'Download', cancel: 'Close' },
      onCancel: () => {},
      onConfirm: () =>
        downloadImage(
          row.original.transactionProof?.path,
          row.original.transactionId || 'transaction-details',
        ),
    });
  };

  return (
    <div className="flex flex-row gap-2">
      <Menu shadow="md" position="left">
        <Menu.Target>
          <ActionIcon size="lg" radius="xs" variant="filled" color="blue">
            <FontAwesomeIcon icon={faEllipsisV} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            icon={
              <FontAwesomeIcon
                icon={row.original.isTransactionValid ? faCircleXmark : faCheckCircle}
              />
            }
            color={row.original.isTransactionValid ? 'cyan' : 'green'}
            disabled={toggleActive.isLoading}
            onClick={handleActivate}
          >
            Mark as {row.original.isTransactionValid ? 'Not Verified' : 'Verified'}
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            icon={<FontAwesomeIcon icon={faEye} />}
            color="blue"
            onClick={handleShowTransactionDetails}
          >
            Show Transaction Details
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

const transactionsTransactionsTable = () => {
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const router = useRouter();

  const transactions = useSocialEventTransactions(
    router.query.id as string,
    pageIndex + 1,
    pageSize,
  );

  const defaultColumns = React.useMemo(
    () => [
      columnHelper.accessor(row => normalizeName(row.student), {
        id: 'studentName',
        header: 'Student Name',
      }),
      columnHelper.accessor(row => row.student.scontoId, {
        id: 'scontoId',
        header: 'Sconto Id',
      }),
      columnHelper.accessor(row => row.student.email, {
        id: 'email',
        header: 'Student Email',
      }),
      columnHelper.accessor(row => row.transactionId, {
        id: 'transactionId',
        header: 'Transaction Id',
      }),
      columnHelper.accessor(row => row.isTransactionValid, {
        id: 'isTransactionValid',
        header: 'Is Transaction Valid?',
        cell: props => (
          <Text color={props.getValue() ? 'green' : 'red'}>{props.getValue() ? 'Yes' : 'No'}</Text>
        ),
      }),
      columnHelper.display({
        id: 'action',
        cell: Actions,
      }),
    ],
    [],
  );

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const table = useReactTable({
    data: transactions.data?.socialEventTransaction ?? [],
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: transactions.data?.pagination.totalPages ?? -1,
    state: { pagination },
    manualPagination: true,
    onPaginationChange: setPagination,
  });

  return (
    <Box>
      <Table highlightOnHover>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}

          {transactions.isFetching ? (
            <tr>
              <td colSpan={table.getVisibleFlatColumns().length}>
                <Progress value={100} animate />
              </td>
            </tr>
          ) : null}
        </tbody>
      </Table>

      <Group position="right" mb="md">
        <div>
          <p>Total: {transactions.data?.pagination.totalDocs}</p>
        </div>
        <Pagination
          total={transactions.data?.pagination?.totalPages ?? 0}
          initialPage={0}
          page={table.getState().pagination.pageIndex + 1}
          onChange={e => {
            table.setPageIndex(e - 1);
          }}
        />
      </Group>

      {/* {transactionProofImage && (
        <Modal opened={opened} onClose={() => setOpened(false)} size="xl">
          <Image
            src={transactionProofImage.path}
            alt={transactionProofImage.path}
            width={60}
            height={60}
          />
        </Modal>
      )} */}
    </Box>
  );
};

export default transactionsTransactionsTable;
