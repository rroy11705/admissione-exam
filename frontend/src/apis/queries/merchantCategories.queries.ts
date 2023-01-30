import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CategoryRequest, ICategory } from '../../types';
import { ApiResponseError } from '../http';
import {
  createMerchantCategory,
  deleteMerchantCategory,
  fetchMerchantCategories,
} from '../requests/merchantCategories.requests';

export const useMerchantCategories = () =>
  useQuery(['categories'], async () => {
    const res = await fetchMerchantCategories();
    return res.data.categories;
  });

export const useCreateMerchantCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ICategory, ApiResponseError, CategoryRequest>(
    async data => {
      const res = await createMerchantCategory(data);
      return res.data.category;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories']);
      },
    },
  );
};

export const useDeleteMerchantCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ICategory, ApiResponseError, string>(
    async categoryId => {
      const res = await deleteMerchantCategory(categoryId);

      return res.data.category;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories']);
      },
      onError: err => {
        showNotification({
          color: 'red',
          message: `Failed to delete category: ${err.message}`,
        });
      },
    },
  );
};
