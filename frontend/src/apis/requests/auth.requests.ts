import { ApiResponse, IUser } from '../../types';
import http from '../http';

export const login = (email: string, password: string) =>
  http.post<ApiResponse<{ user: IUser; token: string }>>('/v1/api/users/login/', {
    email,
    password,
  });

export const verifyUser = (token?: string) =>
  http.get<ApiResponse<{ user: IUser }>>('/v1/api/users/me/', {
    headers: new Headers({
      'Authorization': `Token ${token}`,
    }),
  });
