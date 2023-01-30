import { showNotification } from '@mantine/notifications';
import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';
import { IUser } from '../../types';
import { ApiResponseError } from '../http';
import { login } from '../requests/auth.requests';

// eslint-disable-next-line import/prefer-default-export
export const useLogin = () =>
  useMutation<
    { user: IUser; token: string },
    ApiResponseError,
    { email: string; password: string }
  >(
    async ({ email, password }: { email: string; password: string }) => {
      const res = await login(email, password);
      return res.data;
    },
    {
      onSuccess: res => {
        console.log(res);

        Cookies.set('token', res.token, {
          path: '/',
          sameSite: 'strict',
          expires: 30, // Valid for 30 days
        });

        showNotification({
          title: 'Login successful',
          message: `Welcome ${res.user.first_name}`,
        });
      },
      onError: err => {
        showNotification({
          title: 'Login failed',
          message: err.message,
          color: 'red',
        });
      },
    },
  );
