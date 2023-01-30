import { ApiResponse, CategoryRequest, ICategory } from '../../types';
import http from '../http';

const BASE_URL = '/api/merchant-category';

export const fetchMerchantCategories = () =>
  http.get<ApiResponse<{ categories: Array<ICategory> }>>(BASE_URL);

export const createMerchantCategory = (data: CategoryRequest) =>
  http.post<ApiResponse<{ category: ICategory }>>(BASE_URL, data);

export const deleteMerchantCategory = (categoryId: string) =>
  http.delete<ApiResponse<{ category: ICategory }>>(`${BASE_URL}/${categoryId}`);
