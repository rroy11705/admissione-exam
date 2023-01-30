/* eslint-disable react/no-unstable-nested-components */
import {
  faBan,
  faCheckCircle,
  faChevronRight,
  faCircleXmark,
  faEllipsisV,
  faTrashAlt,
  faPlusCircle,
  faPencil,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ActionIcon,
  Badge,
  Box,
  Divider,
  Group,
  Image,
  Menu,
  Pagination,
  Progress,
  Table,
  Text,
  Title,
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
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';
import {
  useMerchants,
  useRemoveMerchant,
  useToggleFeaturedMerchant,
  useToggleMerchantActive,
  useToggleMerchantVerified,
} from '../../../apis/queries/merchant.queries';
import AppLayout from '../../../components/layouts/AppLayout';
import AddMerchantCategoryModal from '../../../components/merchant/AddMerchantCategoryModal';
import { IMerchant, NextPageWithLayout } from '../../../types';
import { normalizeName } from '../../../utils';
import { withAuth } from '../../../utils/authentication';

const columnHelper = createColumnHelper<IMerchant>();

const Actions: React.FC<CellContext<IMerchant, unknown>> = ({ row }) => {
  const router = useRouter();

  const [isMerchantModalOpen, setMerchantModalOpen] = useState(false);

  const toggleVerified = useToggleMerchantVerified();
  const toggleActive = useToggleMerchantActive();
  const removeMerchant = useRemoveMerchant();
  const toggleFeatured = useToggleFeaturedMerchant();

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
          merchantId: row.original._id,
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
          merchantId: row.original._id,
          status: !row.original.isActive,
        }),
    });
  };

  const handleFeatured = () => {
    openConfirmModal({
      title: 'Are you sure you want to mark this Merchant as featured?',
      children: (
        <Text size="sm">
          Marking this merchant as featured merchant, will increase it's preference in merchant
          listing
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => {},
      onConfirm: () =>
        toggleFeatured.mutate({
          merchantId: row.original._id,
          status: !row.original.isFeatured,
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
            onClick={() => router.push(`/dashboard/merchant/${row.original._id}/edit`)}
          >
            Edit
          </Menu.Item>
          <Menu.Item
            icon={<FontAwesomeIcon icon={faPlusCircle} />}
            color="grey"
            disabled={toggleVerified.isLoading}
            onClick={() => setMerchantModalOpen(true)}
          >
            Add Category
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
            icon={<FontAwesomeIcon icon={row.original.isFeatured ? faBan : faCheckCircle} />}
            color={row.original.isFeatured ? 'orange' : 'green'}
            disabled={toggleFeatured.isLoading}
            onClick={handleFeatured}
          >
            {row.original.isFeatured ? 'Set as not featured' : 'Set as Featured'}
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
        onClick={() => router.push(`/dashboard/merchant/${row.original._id}`)}
      >
        <FontAwesomeIcon icon={faChevronRight} size="1x" />
      </ActionIcon>

      <AddMerchantCategoryModal
        opened={isMerchantModalOpen}
        setOpened={value => setMerchantModalOpen(value)}
        merchantId={row.original._id}
      />
    </div>
  );
};

const Merchants: NextPageWithLayout = () => {
  const defaultColumns = React.useMemo(
    () => [
      columnHelper.accessor(row => row.name, {
        id: 'name',
        header: 'Name',
        cell: props => (
          <Group>
            <Image
              src={props.row.original.logo?.path}
              alt={props.getValue()}
              width={60}
              height={60}
            />
            <span>{props.getValue()}</span>
          </Group>
        ),
      }),
      columnHelper.accessor(row => row.email, { id: 'email', header: 'Email' }),
      columnHelper.accessor(row => row.businessType, {
        id: 'businessType',
        header: 'Business Type',
      }),
      columnHelper.accessor(row => row.category, {
        id: 'category',
        header: 'Category',
        cell: props => {
          const categories = props.getValue();
          return (
            <Box>
              {categories ? (
                categories.length > 0 ? (
                  categories.map(item => <Badge key={item._id}>{item.name}</Badge>)
                ) : (
                  <Text>No Categories</Text>
                )
              ) : (
                <Text>No Categories</Text>
              )}
            </Box>
          );
        },
      }),
      columnHelper.accessor(row => row.storeLocations?.length, {
        id: 'storeLocations',
        header: 'Store Locations',
      }),
      columnHelper.accessor(row => row.isOnline, {
        id: 'isOnline',
        header: 'Is Online',
        cell: props => (
          <Text color={props.getValue() ? 'green' : 'red'}>{props.getValue() ? 'Yes' : 'No'}</Text>
        ),
      }),
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
      columnHelper.accessor(row => row.isFeatured, {
        id: 'isFeatured',
        header: 'Is Featured',
        cell: props => (
          <Text color={props.getValue() ? 'green' : 'red'}>{props.getValue() ? 'Yes' : 'No'}</Text>
        ),
      }),
      columnHelper.accessor(row => normalizeName(row.owner), { id: 'Owner', header: 'Owner' }),
      columnHelper.display({
        id: 'action',
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

  const merchants = useMerchants(pageIndex + 1, pageSize);

  const table = useReactTable({
    data: merchants.data?.merchants ?? [],
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: merchants.data?.pagination.totalPages ?? -1,
    state: { pagination },
    manualPagination: true,
    onPaginationChange: setPagination,
  });

  return (
    <main>
      <Head>
        <title>Merchants</title>
        <meta name="description" content="Merchants" />
      </Head>

      <Title order={3} className="">
        Merchants
      </Title>
      <Divider mb="lg" />

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

          {merchants.isFetching ? (
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
          <p>Total: {merchants.data?.pagination.totalDocs}</p>
        </div>
        <Pagination
          total={merchants.data?.pagination?.totalPages ?? 0}
          initialPage={0}
          page={table.getState().pagination.pageIndex + 1}
          onChange={e => {
            table.setPageIndex(e - 1);
          }}
        />
      </Group>
    </main>
  );
};

Merchants.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = withAuth(async context => ({
  props: {
    user: context.req.user,
  },
}));

export default Merchants;
