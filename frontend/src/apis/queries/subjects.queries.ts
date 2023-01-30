import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ISubject, ITopics, RequestSubject } from '../../types';
import { ApiResponseError } from '../http';
import {
  createSubject,
  createTopic,
  fetchSubjects,
  fetchTopics,
  removeSubject,
  removeTopic,
  updateSubject,
  updateTopic,
} from '../requests/subjects.requests';

export const useCreateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation<ISubject, ApiResponseError, RequestSubject>(
    async data => {
      const res = await createSubject(data);
      return res.data.subject;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['subject']);

        showNotification({
          message: 'Subject Created Successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          message: err.message,
          color: 'red',
        });
      },
    },
  );
};

export const useSubject = (offset: number, limit: number) =>
  useQuery(
    ['subject', offset, limit],
    async () => {
      const res = await fetchSubjects(offset, limit);
      return res.data;
    },
    { keepPreviousData: true },
  );

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation<ISubject, ApiResponseError, RequestSubject>(
    async data => {
      const res = await updateSubject(data);
      return res.data.subject;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['subject']);

        showNotification({
          message: 'Subject Updated Successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          message: err.message,
          color: 'red',
        });
      },
    },
  );
};

export const useRemoveSubject = () => {
  const queryClient = useQueryClient();

  return useMutation<ISubject, ApiResponseError, string>(
    async subjectId => {
      const res = await removeSubject(subjectId);
      return res.data.subject;
    },
    {
      onSuccess: res => {
        queryClient.invalidateQueries(['subject']);
        showNotification({
          message: `${res.name} has been removed successfully!`,
        });
      },
      onError: err => {
        showNotification({
          message: err.message,
          color: 'red',
        });
      },
    },
  );
};

export const useCreateTopic = () => {
  const queryClient = useQueryClient();

  return useMutation<ITopics, ApiResponseError, { subject_id: string; data: ITopics }>(
    async ({ subject_id, data }) => {
      const res = await createTopic(subject_id, data);
      return res.data.topic;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['topic']);

        showNotification({
          message: 'Subject Created Successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          message: err.message,
          color: 'red',
        });
      },
    },
  );
};

export const useTopic = (subject_id: string, offset: number, limit: number) =>
  useQuery(
    ['topic', offset, limit],
    async () => {
      const res = await fetchTopics(subject_id, offset, limit);
      return res.data;
    },
    { keepPreviousData: true },
  );

export const useUpdateTopic = () => {
  const queryClient = useQueryClient();

  return useMutation<ITopics, ApiResponseError, RequestSubject>(
    async data => {
      const res = await updateTopic(data);
      return res.data.topic;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['topic']);

        showNotification({
          message: 'Topic Updated Successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          message: err.message,
          color: 'red',
        });
      },
    },
  );
};

export const useRemoveTopic = () => {
  const queryClient = useQueryClient();

  return useMutation<ITopics, ApiResponseError, string>(
    async topicId => {
      const res = await removeTopic(topicId);
      return res.data.topic;
    },
    {
      onSuccess: res => {
        queryClient.invalidateQueries(['topic']);
        showNotification({
          message: `${res.name} has been removed successfully!`,
        });
      },
      onError: err => {
        showNotification({
          message: err.message,
          color: 'red',
        });
      },
    },
  );
};
