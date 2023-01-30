import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IKYSDetails, KYSRejectionLogs } from '../../types';
import { ApiResponseError } from '../http';
import {
  createRejection,
  fetchKYSDetails,
  updateAadhaar,
  updateCollegeID,
  updateRegistrationCertificate,
  updateRejection,
  updateVerificationStatus,
  verifyStudent,
} from '../requests/kys.requests';

export const useStudentKYSDetails = (studentId: string) =>
  useQuery(
    ['kys', studentId],
    async () => {
      const res = await fetchKYSDetails(studentId);
      return res.data.kysDetails;
    },
    {
      onError: (err: ApiResponseError) => {
        showNotification({
          message: err.message,
          color: 'red',
        });
      },
    },
  );

export const useUpdateAadhaarDetails = (studentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<IKYSDetails, ApiResponseError, Record<string, string | Date | boolean>>(
    async data => {
      const res = await updateAadhaar(studentId, data);
      return res.data.kysDetails;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kys', studentId]);

        showNotification({
          message: 'Updated Aadhaar details',
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

export const useUpdateCollegeIDCardDetails = (studentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<IKYSDetails, ApiResponseError, Record<string, string | Date | boolean>>(
    async data => {
      const res = await updateCollegeID(studentId, data);
      return res.data.kysDetails;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kys', studentId]);

        showNotification({
          message: 'Updated College ID details',
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

export const useUpdateRegistrationCertificateDetails = (studentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<IKYSDetails, ApiResponseError, Record<string, string | Date | boolean>>(
    async data => {
      const res = await updateRegistrationCertificate(studentId, data);
      return res.data.kysDetails;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kys', studentId]);

        showNotification({
          message: 'Updated Registration Certificate details',
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

export const useUpdateStudentVerificationStatus = (studentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<IKYSDetails, ApiResponseError, IKYSDetails['verificationStatus']>(
    async data => {
      const res = await updateVerificationStatus(studentId, data);
      return res.data.kysDetails;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kys', studentId]);

        showNotification({
          message: 'Updated Verfication Status',
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

export const useCreateKYSRejection = (studentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<IKYSDetails, ApiResponseError, Pick<KYSRejectionLogs, 'reason' | 'issueFor'>>(
    async data => {
      const res = await createRejection(studentId, data);
      return res.data.kysDetails;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kys', studentId]);

        showNotification({
          message: 'Rejection created',
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

export const useResolveRejectionLog = (studentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<IKYSDetails, ApiResponseError, { logId: string; isResolved: boolean }>(
    async ({ logId, isResolved }) => {
      const res = await updateRejection(studentId, logId, isResolved);
      return res.data.kysDetails;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kys', studentId]);

        showNotification({
          message: 'Rejection updated',
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

export const useVerifyStudent = () => {
  const queryClient = useQueryClient();

  return useMutation<IKYSDetails, ApiResponseError, string>(
    async studentId => {
      const res = await verifyStudent(studentId);
      return res.data.kysDetails;
    },
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries(['students']);
        queryClient.invalidateQueries(['student', id]);
        queryClient.invalidateQueries(['kys', id]);

        showNotification({
          message: 'Student Verified',
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
