import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IInstitution, RequestInstitution } from '../../types';
import { ApiResponseError } from '../http';
import {
  createInstitution,
  deleteInstitution,
  fetchInstitutions,
} from '../requests/institution.requests';

export const useCreateInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation<IInstitution, ApiResponseError, RequestInstitution>(
    async data => {
      const res = await createInstitution(data);
      return res.data.institution;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['institutions']);

        showNotification({
          message: 'Institution created successfully',
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

export const useInstitutions = (page: number = 1, limit: number = 10) =>
  useQuery(
    ['institutions', page, limit],
    async () => {
      const res = await fetchInstitutions(page, limit);
      return res.data;
    },
    { keepPreviousData: true },
  );

export const useDeleteInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation<IInstitution, ApiResponseError, string>(
    async id => {
      const res = await deleteInstitution(id);
      return res.data.institution;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['institutions']);

        showNotification({
          message: 'Institution removed successfully',
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
