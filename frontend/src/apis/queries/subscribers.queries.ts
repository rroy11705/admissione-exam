/* eslint-disable import/prefer-default-export */
import { useQuery } from '@tanstack/react-query';
import { IPaginator, IContactUs } from '../../types';
import { fetchSubscribers } from '../requests/subscribers.requests';

export const useSubscribers = (page: number = 1, limit: number = 10) =>
  useQuery<{ contactus: Array<IContactUs>; pagination: IPaginator }>(
    ['contactus', page, limit],
    async () => {
      const res = await fetchSubscribers(page, limit);
      return res.data;
    },
    { keepPreviousData: true },
  );
