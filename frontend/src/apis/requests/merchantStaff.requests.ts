import {
  ApiResponse,
  IMerchantStaff,
  IMerchantStaffCreateRequest,
  IMerchantStaffWithMerchant,
  IPaginator,
} from '../../types';
import http from '../http';

export const fetchMerchantStaffs = (page: number, limit: number) => {
  const query = new URLSearchParams({ page: page.toString(), limit: limit.toString() });

  return http.get<
    ApiResponse<{ merchantsStaffs: Array<IMerchantStaffWithMerchant>; pagination: IPaginator }>
  >(`/api/merchant-staff?${query}`);
};

export const fetchMerchantStaffsByMerchant = (merchantId: string) =>
  http.get<
    ApiResponse<{
      allStaffsOfAMerchant: Array<IMerchantStaffWithMerchant>;
      pagination: IPaginator;
    }>
  >(`/api/merchant-staff/merchant/${merchantId}`);

export const fetchMerchantStaffsByStoreLocation = (storeId: string) =>
  http.get<
    ApiResponse<{
      allStaffsOfAMerchantStore: Array<IMerchantStaffWithMerchant>;
      pagination: IPaginator;
    }>
  >(`/api/merchant-staff/store/${storeId}`);

export const createMerchantStaffForMerchant = (
  merchantId: string,
  payload: IMerchantStaffCreateRequest,
) =>
  http.post<ApiResponse<{ staff: IMerchantStaff }>>(
    `/api/merchant-staff/merchant/${merchantId}`,
    payload,
  );

export const createMerchantStaffForStore = (
  storeId: string,
  payload: IMerchantStaffCreateRequest,
) =>
  http.post<ApiResponse<{ staff: IMerchantStaff }>>(
    `/api/merchant-staff/merchant/store/${storeId}`,
    payload,
  );
