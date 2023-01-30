/* eslint-disable import/prefer-default-export */
import type { ApiResponse, IPaginator, IJobApplication } from '../../types';
import http from '../http';

const BASE_URL = '/api/careers';

export const fetchJobApplications = (page: number = 1, limit: number = 10) => {
  const query = new URLSearchParams({ page: page.toString(), limit: limit.toString() });

  return http.get<ApiResponse<{ jobApplicants: Array<IJobApplication>; pagination: IPaginator }>>(
    `${BASE_URL}?${query}`,
  );
};
