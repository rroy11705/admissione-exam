import {
  faBan,
  faCheckCircle,
  faChevronRight,
  faCircleXmark,
  faEllipsisV,
  faTrashAlt,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
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
import { useRouter } from 'next/router';
import React from 'react';
import dynamic from 'next/dynamic';
import {
  useRemoveMerchantStoreLocation,
  useStoreLocations,
  useToggleMerchantStoreLocationActive,
  useToggleMerchantStoreLocationVerified,
} from '../../apis/queries/merchantStoreLocation.queries';
import { IMerchantStoreLocation } from '../../types';

const POS = dynamic(() => import('./POS'), { ssr: false });

type MerchantStoreLocationTableProps = {
  merchantId: string;
};

const columnHelper = createColumnHelper<IMerchantStoreLocation>();

const Actions: React.FC<CellContext<IMerchantStoreLocation, unknown>> = ({ row }) => {
  const router = useRouter();

  const toggleVerified = useToggleMerchantStoreLocationVerified();
  const toggleActive = useToggleMerchantStoreLocationActive();
  const removeMerchant = useRemoveMerchantStoreLocation();

  const handleVerified = () => {
    openConfirmModal({
      title: 'Are you sure you want to mark this Merchant as verified?',
      children: (
        <Text size="sm">
          Marking this merchant as verified will make this merchant visible to the app users
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => {},
      onConfirm: () =>
        toggleVerified.mutate({
          storeId: row.original._id,
          status: !row.original.isVerified,
        }),
    });
  };

  const handleActivate = () => {
    openConfirmModal({
      title: 'Are you sure you want to mark this Merchant as active?',
      children: (
        <Text size="sm">
          Marking this merchant as active will make this merchant visible to the app users
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => {},
      onConfirm: () =>
        toggleActive.mutate({
          storeId: row.original._id,
          status: !row.original.isActive,
        }),
    });
  };

  const handleRemove = () => {
    openConfirmModal({
      title: 'Are you sure you want to delete this merchant?',
      children: <Text size="sm">This will permanently remove the merchant</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => {},
      onConfirm: () => removeMerchant.mutate(row.original._id),
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
            icon={<FontAwesomeIcon icon={faDownload} />}
            color="grey"
            disabled={removeMerchant.isLoading}
          >
            <POS storeName={row.original.name} uniqueId={row.original.uniqueId} />
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            icon={
              <FontAwesomeIcon icon={row.original.isVerified ? faCircleXmark : faCheckCircle} />
            }
            color={row.original.isVerified ? 'cyan' : 'green'}
            disabled={toggleVerified.isLoading}
            onClick={handleVerified}
          >
            Mark as {row.original.isVerified ? 'Not Verified' : 'Verified'}
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            icon={<FontAwesomeIcon icon={row.original.isActive ? faBan : faCheckCircle} />}
            color={row.original.isActive ? 'orange' : 'green'}
            disabled={toggleActive.isLoading}
            onClick={handleActivate}
          >
            {row.original.isActive ? 'Deactivate' : 'Activate'}
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            icon={<FontAwesomeIcon icon={faTrashAlt} />}
            color="red"
            disabled={removeMerchant.isLoading}
            onClick={handleRemove}
          >
            Remove
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <ActionIcon
        size="lg"
        radius="xs"
        variant="filled"
        color="green"
        onClick={() => router.push(`/dashboard/merchant/store/${row.original._id}`)}
      >
        <FontAwesomeIcon icon={faChevronRight} size="1x" />
      </ActionIcon>
    </div>
  );
};

const columns = [
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor(row => row.address.formattedAddress, { header: 'Address' }),
  columnHelper.accessor(row => row.isVerified, {
    id: 'isVerified',
    header: 'Is Verified',
    cell: props => (
      <Text color={props.getValue() ? 'green' : 'red'}>{props.getValue() ? 'Yes' : 'No'}</Text>
    ),
  }),
  columnHelper.accessor(row => row.isActive, {
    id: 'isActive',
    header: 'Is Active',
    cell: props => (
      <Text color={props.getValue() ? 'green' : 'red'}>{props.getValue() ? 'Yes' : 'No'}</Text>
    ),
  }),
  columnHelper.display({
    id: 'action',
    cell: Actions,
  }),
];

const MerchantStoreLocationTable: React.FC<MerchantStoreLocationTableProps> = ({ merchantId }) => {
  const merchantStoreLocations = useStoreLocations(merchantId);

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

  const table = useReactTable({
    data: merchantStoreLocations.data?.merchantStoreLocations ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: merchantStoreLocations.data?.pagination.totalPages ?? -1,
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

          {merchantStoreLocations.isFetching ? (
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
          <p>Total: {merchantStoreLocations.data?.pagination.totalDocs}</p>
        </div>
        <Pagination
          total={merchantStoreLocations.data?.pagination?.totalPages ?? 0}
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

export default MerchantStoreLocationTable;
