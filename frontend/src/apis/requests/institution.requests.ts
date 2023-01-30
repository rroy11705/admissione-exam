import { ApiResponse, IInstitution, IPaginator, RequestInstitution } from '../../types';
import http from '../http';

const BASE_URL = '/api/institutions';

export const fetchInstitutions = (page: number = 1, limit: number = 10) => {
  const query = new URLSearchParams({ page: page.toString(), limit: limit.toString() });

  return http.get<ApiResponse<{ institutions: Array<IInstitution>; pagination: IPaginator }>>(
    `${BASE_URL}?${query}`,
  );
};

export const createInstitution = (data: RequestInstitution) =>
  http.post<ApiResponse<{ institution: IInstitution }>>(BASE_URL, data);

export const deleteInstitution = (instituteId: string) =>
  http.delete<ApiResponse<{ institution: IInstitution }>>(`${BASE_URL}/${instituteId}`);
