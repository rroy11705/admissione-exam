/* eslint-disable import/prefer-default-export */
import { showNotification } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { IUpload } from '../../types';
import { ApiResponseError } from '../http';
import { uploadFile } from '../requests/upload.requests';

export const useUpload = () =>
  useMutation<IUpload, ApiResponseError, FormData>(
    async data => {
      const res = await uploadFile(data);
      return res.data.file;
    },
    {
      onError: err => {
        showNotification({
          message: err.message,
          color: 'red',
        });
      },
    },
  );
