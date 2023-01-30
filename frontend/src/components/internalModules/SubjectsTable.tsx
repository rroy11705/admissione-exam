/* eslint-disable react/no-unstable-nested-components */
import {
  faChevronRight,
  faEllipsisV,
  faPencil,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Box, Group, Menu, Pagination, Progress, Table, Text } from '@mantine/core';
import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import { openConfirmModal } from '@mantine/modals';
import { useRouter } from 'next/router';
import { useRemoveSubject, useSubject } from '../../apis/queries/subjects.queries';
import { ISubject } from '../../types';
import AddUpdateSubject from './AddUpdateSubject';

const columnHelper = createColumnHelper<ISubject>();

const Actions: React.FC<CellContext<ISubject, unknown>> = ({ row }) => {
  const router = useRouter();
  const remove = useRemoveSubject();
  const [addInstituteOpened, setAddInstituteOpened] = useState(false);

  const handleRemove = () => {
    openConfirmModal({
      title: 'Are you sure you want to remove this subject?',
      children: (
        <Text size="sm">Removing this Subject will delete its topics and related questions.</Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => {},
      onConfirm: () => {
        remove.mutate(row.original._id);
      },
    });
  };

  const renderUpdateSubjectModal = React.useCallback(
    () => (
      <AddUpdateSubject
        subject={row.original}
        opened={addInstituteOpened}
        onClose={() => setAddInstituteOpened(false)}
      />
    ),
    [row.original, addInstituteOpened],
  );

  return (
    <div className="flex flex-row gap-2">
      <Menu shadow="md">
        <Menu.Target>
          <ActionIcon size="lg" radius="xs" variant="filled" color="blue">
            <FontAwesomeIcon icon={faEllipsisV} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            icon={<FontAwesomeIcon icon={faPencil} />}
            color="blue"
            onClick={() => setAddInstituteOpened(true)}
          >
            Edit
          </Menu.Item>
          <Menu.Item
            icon={<FontAwesomeIcon icon={faTrashAlt} />}
            color="red"
            disabled={remove.isLoading}
            onClick={handleRemove}
          >
            Remove
          </Menu.Item>
        </Menu.Dropdown>
        <ActionIcon
          size="lg"
          radius="xs"
          variant="filled"
          color="green"
          onClick={() =>
            router.push(`/dashboard/internal-modules/subjects/${row.original._id}/topics`)
          }
        >
          <FontAwesomeIcon icon={faChevronRight} size="1x" />
        </ActionIcon>
      </Menu>
      {renderUpdateSubjectModal()}
    </div>
  );
};

const StudentTable = () => {
  const defaultColumns = React.useMemo(
    () => [
      columnHelper.accessor(row => row._id, {
        id: '_id',
        header: 'Subject Id',
        cell: props => <Box>{props.getValue()}</Box>,
      }),
      columnHelper.accessor(row => row.name, {
        id: 'name',
        header: 'Subject Name',
        cell: props => <Box>{props.getValue()}</Box>,
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

  const subjects = useSubject(pageIndex * pageSize, pageSize);

  const table = useReactTable({
    data: subjects.data?.subjects ?? [],
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: subjects.data?.pagination.pages,
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

          {subjects.isFetching ? (
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
          <p>Total: {subjects.data?.pagination.count}</p>
        </div>
        <Pagination
          total={subjects.data?.pagination?.pages ?? 0}
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

export default StudentTable;
