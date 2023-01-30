/* eslint-disable react/no-unstable-nested-components */
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Badge, Box, Group, Image, Pagination, Progress, Table } from '@mantine/core';
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
import { useSocialEvent } from '../../apis/queries/socialEvents.queries';
import { ISocialEvent } from '../../types';

const columnHelper = createColumnHelper<ISocialEvent>();

const Actions: React.FC<CellContext<ISocialEvent, unknown>> = ({ row }) => {
  const router = useRouter();
  return (
    <div className="flex flex-row gap-2">
      <ActionIcon
        size="lg"
        radius="xs"
        variant="filled"
        color="green"
        onClick={() => router.push(`/dashboard/social-events/${row.original._id}`)}
      >
        <FontAwesomeIcon icon={faChevronRight} size="1x" />
      </ActionIcon>
    </div>
  );
};

const SocialEventTable = () => {
  const defaultColumns = React.useMemo(
    () => [
      columnHelper.accessor(row => row.name, {
        id: 'name',
        header: 'Name',
        cell: props => (
          <Group>
            <Image
              src={props.row.original.image?.path}
              alt={props.getValue()}
              width={60}
              height={60}
            />
            <span>{props.getValue()}</span>
          </Group>
        ),
      }),
      columnHelper.accessor(row => row.startDate, {
        id: 'startDate',
        header: 'Start Date',
        cell: props => new Date(props.getValue()).toLocaleString(),
      }),
      columnHelper.accessor(row => row.endDate, {
        id: 'endDate',
        header: 'End Date',
        cell: props => new Date(props.getValue()).toLocaleString(),
      }),
      columnHelper.accessor(row => row.paymentMethods, {
        id: 'paymentMethods',
        header: 'Payment Methods',
        cell: props => (
          <Box className="flex flex-row gap-4">
            {props.getValue()?.map(item => (
              <Badge key={item}>{item}</Badge>
            ))}
          </Box>
        ),
      }),
      columnHelper.display({
        id: 'action',
        cell: Actions,
      }),
    ],
    [],
  );

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const socialEvent = useSocialEvent(pageIndex + 1, pageSize);

  const table = useReactTable({
    data: socialEvent.data?.socialEvents ?? [],
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: socialEvent.data?.pagination.totalPages ?? -1,
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

          {socialEvent.isFetching ? (
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
          <p>Total: {socialEvent.data?.pagination.totalDocs}</p>
        </div>
        <Pagination
          total={socialEvent.data?.pagination?.totalPages ?? 0}
          initialPage={0}
          page={table.getState().pagination.pageIndex + 1}
          onChange={e => {
            table.setPageIndex(e - 1);
          }}
        />
      </Group>
    </Box>
  );
};

export default SocialEventTable;
