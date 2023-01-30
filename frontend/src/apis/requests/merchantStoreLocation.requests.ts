import {
  ApiResponse,
  IMerchantStoreLocation,
  IPaginator,
  RequestMerchantStoreLocation,
} from '../../types';
import http from '../http';

const BASE_URL = '/api/merchants';

export const createMerchantStoreLocation = (
  merchantId: string,
  data: RequestMerchantStoreLocation,
) =>
  http.post<ApiResponse<{ merchantStore: IMerchantStoreLocation }>>(
    `${BASE_URL}/${merchantId}/store`,
    data,
  );

export const fetchMerchantStoreLocations = (
  merchantId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const query = new URLSearchParams({ page: page.toString(), limit: limit.toString() });

  return http.get<
    ApiResponse<{ merchantStoreLocations: Array<IMerchantStoreLocation>; pagination: IPaginator }>
  >(`${BASE_URL}/${merchantId}/store?${query}`);
};

export const fetchMerchantStoreLocation = (storeId: string) =>
  http.get<ApiResponse<{ merchantStore: IMerchantStoreLocation }>>(
    `/api/merchants/stores/${storeId}`,
  );

export const removeMerchantStoreLocation = (storeId: string) =>
  http.delete<ApiResponse<{ merchantStore: IMerchantStoreLocation }>>(
    `${BASE_URL}/store/${storeId}`,
  );

export const toggleMerchantStoreLocationActiveStatus = (storeId: string, status: boolean) =>
  http.put<ApiResponse<{ merchantStore: IMerchantStoreLocation }>>(
    `${BASE_URL}/stores/${storeId}/active-toggler`,
    {
      isActive: status,
    },
  );

export const toggleMerchantStoreLocationVerifiedStatus = (storeId: string, status: boolean) =>
  http.put<ApiResponse<{ merchantStore: IMerchantStoreLocation }>>(
    `${BASE_URL}/stores/${storeId}/verified-toggler`,
    {
      isVerified: status,
    },
  );
