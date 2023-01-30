/* eslint-disable import/prefer-default-export */
import type { ApiResponse, IPaginator, IStudent } from '../../types';
import http from '../http';

const BASE_URL = '/api/students';

export const fetchStudents = (page: number = 1, limit: number = 10) => {
  const query = new URLSearchParams({ page: page.toString(), limit: limit.toString() });

  return http.get<ApiResponse<{ students: Array<IStudent>; pagination: IPaginator }>>(
    `${BASE_URL}?${query}`,
  );
};

export const fetchStudent = (studentId: string) =>
  http.get<ApiResponse<{ student: IStudent }>>(`${BASE_URL}/${studentId}`);
