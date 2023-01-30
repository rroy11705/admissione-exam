import { isEmpty } from 'lodash';
import type { ApiResponse, ICategory, IMerchant, IPaginator, RequestMerchant } from '../../types';
import http from '../http';

const BASE_URL = '/api/merchants';

export const createMerchant = (data: RequestMerchant) =>
  http.post<ApiResponse<{ merchant: IMerchant }>>(`${BASE_URL}`, data);

export const updateMerchant = (merchantId: string, data: RequestMerchant) =>
  http.put<ApiResponse<{ merchant: IMerchant }>>(`${BASE_URL}/${merchantId}`, data);

export const fetchMerchants = (page: number, limit: number, search?: string) => {
  const query = new URLSearchParams({ page: page.toString(), limit: limit.toString() });

  if (!isEmpty(search)) query.append('search', String(search));

  return http.get<ApiResponse<{ merchants: Array<IMerchant>; pagination: IPaginator }>>(
    `${BASE_URL}?${query}`,
  );
};

export const fetchMerchant = (id: string) =>
  http.get<ApiResponse<{ merchant: IMerchant }>>(`${BASE_URL}/${id}`);

export const removeMerchant = (merchantId: string) =>
  http.delete<ApiResponse<{ merchant: IMerchant }>>(`${BASE_URL}/${merchantId}`);

export const toggleMerchantActiveStatus = (merchantId: string, status: boolean) =>
  http.post<ApiResponse<{ merchant: IMerchant }>>(`${BASE_URL}/${merchantId}/toggle-status`, {
    isActive: status,
  });

export const toggleMerchantVerifiedStatus = (merchantId: string, status: boolean) =>
  http.put<ApiResponse<{ merchant: IMerchant }>>(`${BASE_URL}/${merchantId}/verified-toggler`, {
    isVerified: status,
  });

export const toggleMerchantOnlineStatus = (merchantId: string, status: boolean) =>
  http.put<ApiResponse<{ merchant: IMerchant }>>(`${BASE_URL}/${merchantId}/online-toggler`, {
    isOnline: status,
  });

export const toggleFeaturedMerchant = (merchantId: string, status: boolean) =>
  http.put<ApiResponse<{ merchant: IMerchant }>>(`${BASE_URL}/${merchantId}/featured-toggler`, {
    isFeatured: status,
  });

export const addCategoryToMerchant = (merchantId: string, categoryId: string) =>
  http.post<ApiResponse<{ merchant: IMerchant }>>('/api/merchant-category/add-category', {
    merchantId,
    categoryId,
  });

export const getMerchantCategory = () =>
  http.get<ApiResponse<{ categories: Array<ICategory> }>>('/api/merchant-category');
