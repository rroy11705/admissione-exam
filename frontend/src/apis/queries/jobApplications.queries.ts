/* eslint-disable import/prefer-default-export */
import { useQuery } from '@tanstack/react-query';
import { IPaginator, IJobApplication } from '../../types';
import { fetchJobApplications } from '../requests/jobApplications.requests';

export const useJobApplicants = (page: number = 1, limit: number = 10) =>
  useQuery<{ jobApplicants: Array<IJobApplication>; pagination: IPaginator }>(
    ['jobApplicants', page, limit],
    async () => {
      const res = await fetchJobApplications(page, limit);
      return res.data;
    },
    { keepPreviousData: true },
  );
