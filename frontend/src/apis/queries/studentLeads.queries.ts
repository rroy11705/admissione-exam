/* eslint-disable import/prefer-default-export */
import { useQuery } from '@tanstack/react-query';
import { IStudentLead, IPaginator } from '../../types';
import { fetchStudentLeads } from '../requests/studentLead.requests';

export const useStudentLeads = (page: number = 1, limit: number = 10) =>
  useQuery<{ students: Array<IStudentLead>; pagination: IPaginator }>(
    ['students', page, limit],
    async () => {
      const res = await fetchStudentLeads(page, limit);
      return res.data;
    },
    { keepPreviousData: true },
  );
