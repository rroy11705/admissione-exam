import { faEllipsisV, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Group, Menu, Pagination, Progress, Table, Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';
import { useDeleteInstitution, useInstitutions } from '../../apis/queries/institution.queries';
import { IInstitution } from '../../types';

const columnHelper = createColumnHelper<IInstitution>();

const Actions: React.FC<CellContext<IInstitution, unknown>> = ({ row }) => {
  const remove = useDeleteInstitution();

  const handleRemove = () => {
    openConfirmModal({
      title: 'Are you sure you want to remove this merchant?',
      children: <Text size="sm">Removing this institution will reflect in app</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => {},
      onConfirm: () => {
        remove.mutate(row.original._id);
      },
    });
  };

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
            icon={<FontAwesomeIcon icon={faTrashAlt} />}
            color="red"
            disabled={remove.isLoading}
            onClick={handleRemove}
          >
            Remove
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

const InstitutionTable = () => {
  const defaultColumns = React.useMemo(
    () => [
      columnHelper.accessor('name', {
        cell: info => info.getValue(),
      }),
      columnHelper.display({
        id: 'action',
        header: 'Actions',
        cell: Actions,
      }),
    ],
    [],
  );

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const institutions = useInstitutions(pageIndex + 1, pageSize);

  const table = useReactTable({
    data: institutions.data?.institutions ?? [],
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: institutions.data?.pagination.totalPages ?? -1,
    state: { pagination },
    manualPagination: true,
    onPaginationChange: setPagination,
  });

  return (
    <section>
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

          {institutions.isFetching ? (
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
          <p>Total: {institutions.data?.pagination.totalDocs}</p>
        </div>
        <Pagination
          total={institutions.data?.pagination?.totalPages ?? 0}
          initialPage={0}
          page={table.getState().pagination.pageIndex + 1}
          onChange={e => {
            table.setPageIndex(e - 1);
          }}
        />
      </Group>
    </section>
  );
};

export default InstitutionTable;
