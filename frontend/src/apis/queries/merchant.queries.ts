import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IMerchant, RequestMerchant } from '../../types';
import { ApiResponseError } from '../http';
import {
  addCategoryToMerchant,
  createMerchant,
  fetchMerchants,
  getMerchantCategory,
  removeMerchant,
  toggleFeaturedMerchant,
  toggleMerchantActiveStatus,
  toggleMerchantVerifiedStatus,
  updateMerchant,
} from '../requests/merchant.requests';

export const useCreateMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation<IMerchant, ApiResponseError, RequestMerchant>(
    async data => {
      const res = await createMerchant(data);
      return res.data.merchant;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['merchants']);

        showNotification({
          message: 'Merchant Onboarded Successfully',
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

export const useUpdateMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation<IMerchant, ApiResponseError, { merchantId: string; data: RequestMerchant }>(
    async ({ merchantId, data }) => {
      const res = await updateMerchant(merchantId, data);
      return res.data.merchant;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['merchants']);

        showNotification({
          message: 'Merchant Updated Successfully',
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

export const useMerchants = (page: number, limit: number, search?: string) =>
  useQuery(
    ['merchants', page, limit, search],
    async () => {
      const res = await fetchMerchants(page, limit, search);
      return res.data;
    },
    { keepPreviousData: true },
  );

export const useRemoveMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation<IMerchant, ApiResponseError, string>(
    async merchantId => {
      const res = await removeMerchant(merchantId);
      return res.data.merchant;
    },
    {
      onSuccess: res => {
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

export const useToggleMerchantVerified = () => {
  const queryClient = useQueryClient();

  return useMutation<IMerchant, ApiResponseError, { merchantId: string; status: boolean }>(
    async ({ merchantId, status }) => {
      const res = await toggleMerchantVerifiedStatus(merchantId, status);
      return res.data.merchant;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['merchants']);
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

export const useToggleMerchantActive = () => {
  const queryClient = useQueryClient();

  return useMutation<IMerchant, ApiResponseError, { merchantId: string; status: boolean }>(
    async ({ merchantId, status }) => {
      const res = await toggleMerchantActiveStatus(merchantId, status);
      return res.data.merchant;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['merchants']);
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

export const useToggleFeaturedMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation<IMerchant, ApiResponseError, { merchantId: string; status: boolean }>(
    async ({ merchantId, status }) => {
      const res = await toggleFeaturedMerchant(merchantId, status);
      return res.data.merchant;
    },
    {
      onSuccess: res => {
        queryClient.invalidateQueries(['merchants']);
        queryClient.invalidateQueries(['merchant', res._id]);
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

export const useAddCategoryToMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation<IMerchant, ApiResponseError, { merchantId: string; categoryId: string }>(
    async ({ merchantId, categoryId }) => {
      const res = await addCategoryToMerchant(merchantId, categoryId);
      return res.data.merchant;
    },
    {
      onSuccess: res => {
        queryClient.invalidateQueries(['merchants']);
        queryClient.invalidateQueries(['merchant', res._id]);
        showNotification({
          message: 'Merchant category added successfully',
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

export const useMerchantCategory = () =>
  useQuery(
    ['merchant-categories'],
    async () => {
      const res = await getMerchantCategory();
      return res.data.categories;
    },
    { keepPreviousData: true },
  );
