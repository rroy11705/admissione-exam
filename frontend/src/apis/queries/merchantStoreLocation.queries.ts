import { showNotification } from '@mantine/notifications';
import { isEmpty } from 'lodash';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IMerchantStoreLocation, RequestMerchantStoreLocation } from '../../types';
import { ApiResponseError } from '../http';
import {
  createMerchantStoreLocation,
  fetchMerchantStoreLocation,
  fetchMerchantStoreLocations,
  removeMerchantStoreLocation,
  toggleMerchantStoreLocationActiveStatus,
  toggleMerchantStoreLocationVerifiedStatus,
} from '../requests/merchantStoreLocation.requests';

export const useCreateStoreLocation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IMerchantStoreLocation,
    ApiResponseError,
    {
      merchantId: string;
      store: RequestMerchantStoreLocation;
    }
  >(
    async data => {
      const res = await createMerchantStoreLocation(data.merchantId, data.store);
      return res.data.merchantStore;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['merchants']);
        queryClient.invalidateQueries(['merchant-store-locations']);

        showNotification({
          message: 'Merchant Store Successfully',
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

export const useMerchantStore = (storeId?: string) =>
  useQuery(
    ['merchant-store-locations', storeId],
    async () => {
      const res = await fetchMerchantStoreLocation(String(storeId));
      return res.data.merchantStore;
    },
    {
      enabled: !!storeId,
    },
  );

export const useStoreLocations = (merchantId: string, page: number = 1, limit: number = 10) =>
  useQuery(
    ['merchant-store-locations', merchantId, page, limit],
    async () => {
      const res = await fetchMerchantStoreLocations(merchantId, page, limit);
      return res.data;
    },
    {
      retry: false,
      keepPreviousData: true,
      enabled: !isEmpty(merchantId),
    },
  );

export const useRemoveMerchantStoreLocation = () => {
  const queryClient = useQueryClient();

  return useMutation<IMerchantStoreLocation, ApiResponseError, string>(
    async storeId => {
      const res = await removeMerchantStoreLocation(storeId);
      return res.data.merchantStore;
    },
    {
      onSuccess: res => {
        queryClient.invalidateQueries(['merchant-store-locations']);
        queryClient.invalidateQueries(['merchants']);

        showNotification({
          message: `${res.name} has been removed`,
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

export const useToggleMerchantStoreLocationVerified = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IMerchantStoreLocation,
    ApiResponseError,
    { storeId: string; status: boolean }
  >(
    async ({ storeId, status }) => {
      const res = await toggleMerchantStoreLocationVerifiedStatus(storeId, status);
      return res.data.merchantStore;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['merchant-store-locations']);
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

export const useToggleMerchantStoreLocationActive = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IMerchantStoreLocation,
    ApiResponseError,
    { storeId: string; status: boolean }
  >(
    async ({ storeId, status }) => {
      const res = await toggleMerchantStoreLocationActiveStatus(storeId, status);
      return res.data.merchantStore;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['merchant-store-locations']);
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
