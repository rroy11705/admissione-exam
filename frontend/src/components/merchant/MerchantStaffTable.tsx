import { Progress, Table } from '@mantine/core';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';
import { IMerchantStaffWithMerchant } from '../../types';
import { useMerchantStaffsByMerchant } from '../../apis/queries/merchantStaff.queries';

type MerchantStaffTableProps = {
  merchantId: string;
};

const columnHelper = createColumnHelper<IMerchantStaffWithMerchant>();

const MerchantStaffTable: React.FC<MerchantStaffTableProps> = ({ merchantId }) => {
  const columns = React.useMemo(
    () => [
      columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
        id: 'name',
        header: 'Name',
      }),
      columnHelper.accessor(row => row.email, {
        id: 'email',
        header: 'Email',
      }),
      columnHelper.accessor(row => row.role, {
        id: 'role',
        header: 'Role',
      }),
    ],
    [],
  );

  // const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
  //   pageIndex: 0,
  //   pageSize: 5,
  // });

  const merchantStaffs = useMerchantStaffsByMerchant(merchantId);

  // const pagination = React.useMemo(
  //   () => ({
  //     pageIndex,
  //     pageSize,
  //   }),
  //   [pageIndex, pageSize],
  // );

  const table = useReactTable({
    data: merchantStaffs?.data?.allStaffsOfAMerchant ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    // pageCount: staffs.data?.pagination.totalPages ?? -1,
    // state: { pagination },
    manualPagination: false,
    // onPaginationChange: setPagination,
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

          {merchantStaffs.isFetching ? (
            <tr>
              <td colSpan={table.getVisibleFlatColumns().length}>
                <Progress value={100} animate />
              </td>
            </tr>
          ) : null}
        </tbody>
      </Table>

      {/* <Group position="right" mb="md">
        <div>
          <p>Total: {staffs.data?.pagination.totalDocs}</p>
        </div>
        <Pagination
          total={staffs.data?.pagination?.totalPages ?? 0}
          initialPage={0}
          page={table.getState().pagination.pageIndex + 1}
          onChange={e => {
            table.setPageIndex(e - 1);
          }}
        />
      </Group> */}
    </section>
  );
};

export default MerchantStaffTable;
