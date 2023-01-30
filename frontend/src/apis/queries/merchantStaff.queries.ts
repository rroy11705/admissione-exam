import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import { IMerchantStaff, IMerchantStaffCreateRequest } from '../../types';
import { ApiResponseError } from '../http';
import {
  createMerchantStaffForMerchant,
  createMerchantStaffForStore,
  fetchMerchantStaffs,
  fetchMerchantStaffsByMerchant,
  fetchMerchantStaffsByStoreLocation,
} from '../requests/merchantStaff.requests';

export const useMerchantStaffs = (page: number, limit: number) =>
  useQuery(['merchant-staffs', page, limit], async () => {
    const res = await fetchMerchantStaffs(page, limit);
    return res.data;
  });

export const useMerchantStaffsByMerchant = (merchantId: string) =>
  useQuery(
    ['merchant-staffs-by-merchant'],
    async () => {
      const res = await fetchMerchantStaffsByMerchant(merchantId);
      return res.data;
    },
    {
      retry: false,
      keepPreviousData: true,
      enabled: !isEmpty(merchantId),
    },
  );

export const useMerchantStaffsByStoreLocation = (storeId: string) =>
  useQuery(
    ['merchant-staffs-by-store-location'],
    async () => {
      const res = await fetchMerchantStaffsByStoreLocation(storeId);
      return res.data;
    },
    {
      retry: false,
      keepPreviousData: true,
      enabled: !isEmpty(storeId),
    },
  );

export const useCreateMerchantStaff = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IMerchantStaff,
    ApiResponseError,
    { merchantId: string; payload: IMerchantStaffCreateRequest }
  >(
    async ({ merchantId, payload }) => {
      const res = await createMerchantStaffForMerchant(merchantId, payload);
      return res.data.staff;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['merchant-staffs']);
        queryClient.invalidateQueries(['merchant-staffs-by-merchant']);

        showNotification({
          message: 'Merchant Owner Created Successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          message: err.message,
          color: 'red',
        });
      },
    },
  );
};

export const useCreateMerchantStaffForStore = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IMerchantStaff,
    ApiResponseError,
    { storeId: string; payload: IMerchantStaffCreateRequest }
  >(
    async ({ storeId, payload }) => {
      const res = await createMerchantStaffForStore(storeId, payload);
      return res.data.staff;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['merchant-staffs']);
        queryClient.invalidateQueries(['merchant-staffs-by-store-location']);

        showNotification({
          message: 'Staff For Merchant Store Created Successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          message: err.message,
          color: 'red',
        });
      },
    },
  );
};
