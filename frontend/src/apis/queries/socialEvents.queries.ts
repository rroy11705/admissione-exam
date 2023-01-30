import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ISocialEvent, ISocialEventTransaction, RequestSocialEvent } from '../../types';
import { ApiResponseError } from '../http';
import {
  createSocialEvent,
  fetchSocialEvent,
  fetchSocialEventTransactions,
  toggleSocialEventTransactionActiveStatus,
} from '../requests/socialEvent.requests';

export const useCreateSocialEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<ISocialEvent, ApiResponseError, RequestSocialEvent>(
    async data => {
      const res = await createSocialEvent(data);
      return res.data.socialEvent;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['social-event']);

        showNotification({
          message: 'Social Event Created Successfully',
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

export const useSocialEvent = (page: number, limit: number) =>
  useQuery(
    ['social-event', page, limit],
    async () => {
      const res = await fetchSocialEvent(page, limit);
      return res.data;
    },
    { keepPreviousData: true },
  );

export const useSocialEventTransactions = (
  eventId: string,
  page?: number,
  limit?: number,
  isValid?: boolean,
) =>
  useQuery(
    ['social-event-transactions', page, limit, isValid],
    async () => {
      const res = await fetchSocialEventTransactions(eventId, page, limit, isValid);
      return res.data;
    },
    {
      enabled: !!eventId,
      keepPreviousData: true,
    },
  );

export const useToggleSocialEventTransactionActive = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ISocialEventTransaction,
    ApiResponseError,
    { transactionId: string; isValid: boolean }
  >(
    async ({ transactionId, isValid }) => {
      const res = await toggleSocialEventTransactionActiveStatus(transactionId, isValid);
      return res.data.socialEventTransactionMarkValid;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['social-event-transactions']);
        showNotification({
          message: 'Transaction Validation Successful!',
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
