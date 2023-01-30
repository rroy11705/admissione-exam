/* eslint-disable import/prefer-default-export */
import { ApiResponse, IUpload } from '../../types';
import http from '../http';

export const uploadFile = (data: FormData) =>
  http.post<ApiResponse<{ file: IUpload }>>('/api/upload', data, {
    hasFiles: true,
  });
