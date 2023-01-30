import type {
  ApiResponse,
  IPaginator,
  ISocialEvent,
  RequestSocialEvent,
  ISocialEventTransaction,
} from '../../types';
import http from '../http';

const BASE_URL = '/api/social-events';

export const createSocialEvent = (data: RequestSocialEvent) =>
  http.post<ApiResponse<{ socialEvent: ISocialEvent }>>(`${BASE_URL}`, data);

export const fetchSocialEvent = (page: number, limit: number) => {
  const query = new URLSearchParams({ page: page.toString(), limit: limit.toString() });

  return http.get<ApiResponse<{ socialEvents: Array<ISocialEvent>; pagination: IPaginator }>>(
    `${BASE_URL}?${query}`,
  );
};

export const fetchSocialEventTransactions = (
  eventId: string,
  page?: number,
  limit?: number,
  isValid?: boolean,
) => {
  const query = new URLSearchParams();

  if (typeof page !== 'undefined') query.append('page', page.toString());
  if (typeof limit !== 'undefined') query.append('limit', limit.toString());
  if (typeof isValid !== 'undefined') query.append('isValid', isValid.toString());

  return http.get<
    ApiResponse<{ socialEventTransaction: Array<ISocialEventTransaction>; pagination: IPaginator }>
  >(`${BASE_URL}/${eventId}/transactions?${query}`);
};

export const toggleSocialEventTransactionActiveStatus = (transactionId: string, isValid: boolean) =>
  http.patch<ApiResponse<{ socialEventTransactionMarkValid: ISocialEventTransaction }>>(
    `${BASE_URL}/transactions/${transactionId}/mark-as-valid`,
    {
      isValid,
    },
  );
