/* eslint-disable import/prefer-default-export */
import type { ApiResponse, IStudentLead, IPaginator } from '../../types';
import http from '../http';

const BASE_URL = '/api/students/leads';

export const fetchStudentLeads = (page: number = 1, limit: number = 10) => {
  const query = new URLSearchParams({ page: page.toString(), limit: limit.toString() });

  return http.get<ApiResponse<{ students: Array<IStudentLead>; pagination: IPaginator }>>(
    `${BASE_URL}?${query}`,
  );
};
