import type { ApiResponse, IPaginator, ISubject, ITopics, RequestSubject } from '../../types';
import http from '../http';

export const createSubject = (data: RequestSubject) =>
  http.post<ApiResponse<{ subject: ISubject }>>('/v1/api/subject/create/', data);

export const fetchSubjects = (offset: number, limit: number) => {
  const query = new URLSearchParams({ page_offset: offset.toString(), limit: limit.toString() });

  return http.get<ApiResponse<{ subjects: Array<ISubject>; pagination: IPaginator }>>(
    `/v1/api/subject/?${query}`,
  );
};

export const updateSubject = (data: RequestSubject) =>
  http.put<ApiResponse<{ subject: ISubject }>>(`/v1/api/subject/${data._id}/update/`, {
    name: data.name,
  });

export const removeSubject = (id: string) =>
  http.delete<ApiResponse<{ subject: ISubject }>>(`/v1/api/subject/${id}/delete/`);

export const createTopic = (subject_id: string, data: RequestSubject) =>
  http.post<ApiResponse<{ topic: ITopics }>>(`/v1/api/subject/${subject_id}/topic/create/`, data);

export const fetchTopics = (subject_id: string, offset: number, limit: number) => {
  const query = new URLSearchParams({ page_offset: offset.toString(), limit: limit.toString() });

  return http.get<ApiResponse<{ topics: Array<ITopics>; pagination: IPaginator }>>(
    `/v1/api/subject/${subject_id}/topics/?${query}`,
  );
};

export const updateTopic = (data: RequestSubject) =>
  http.put<ApiResponse<{ topic: ITopics }>>(`/v1/api/subject/topic/${data._id}/update/`, {
    name: data.name,
  });

export const removeTopic = (id: string) =>
  http.delete<ApiResponse<{ topic: ITopics }>>(`/v1/api/subject/topic/${id}/delete/`);
