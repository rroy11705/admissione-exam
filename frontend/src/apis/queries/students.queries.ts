import { useQuery } from '@tanstack/react-query';
import { IPaginator, IStudent } from '../../types';
import { fetchStudent, fetchStudents } from '../requests/students.requests';

export const useStudents = (page: number = 1, limit: number = 10) =>
  useQuery<{ students: Array<IStudent>; pagination: IPaginator }>(
    ['students', page, limit],
    async () => {
      const res = await fetchStudents(page, limit);
      return res.data;
    },
    { keepPreviousData: true },
  );

export const useStudent = (studentId: string) =>
  useQuery(['student', studentId], async () => {
    const res = await fetchStudent(studentId);

    return res.data.student;
  });
