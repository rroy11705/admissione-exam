/* eslint-disable react/no-unstable-nested-components */
import { faEllipsisV, faPencil, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
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
import { useRemoveTopic, useTopic } from '../../apis/queries/subjects.queries';
import { ITopics } from '../../types';
import AddUpdateTopic from './AddUpdateTopic';

type TopicsTableProps = {
  subject_id: string;
};

const columnHelper = createColumnHelper<ITopics>();

const Actions: React.FC<CellContext<ITopics, unknown>> = ({ row }) => {
  const remove = useRemoveTopic();
  const [addTopicModalOpened, setAddTopicModalOpened] = useState(false);

  const handleRemove = () => {
    openConfirmModal({
      title: 'Are you sure you want to remove this topic?',
      children: <Text size="sm">Removing this topic will delete its related questions.</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => {},
      onConfirm: () => {
        remove.mutate(row.original._id);
      },
    });
  };

  const renderUpdateTopicModal = React.useCallback(
    () => (
      <AddUpdateTopic
        topic={row.original}
        opened={addTopicModalOpened}
        onClose={() => setAddTopicModalOpened(false)}
      />
    ),
    [row.original, addTopicModalOpened],
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
            onClick={() => setAddTopicModalOpened(true)}
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
      </Menu>
      {renderUpdateTopicModal()}
    </div>
  );
};

const TopicsTable: React.FC<TopicsTableProps> = ({ subject_id }) => {
  const defaultColumns = React.useMemo(
    () => [
      columnHelper.accessor(row => row._id, {
        id: '_id',
        header: 'Topic Id',
        cell: props => <Box>{props.getValue()}</Box>,
      }),
      columnHelper.accessor(row => row.name, {
        id: 'name',
        header: 'Topic Name',
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

  const topics = useTopic(subject_id, pageIndex * pageSize, pageSize);

  const table = useReactTable({
    data: topics.data?.topics ?? [],
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: topics.data?.pagination.pages,
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

          {topics.isFetching ? (
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
          <p>Total: {topics.data?.pagination.count}</p>
        </div>
        <Pagination
          total={topics.data?.pagination?.pages ?? 0}
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

export default TopicsTable;
