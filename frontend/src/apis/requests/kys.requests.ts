import { ApiResponse, IKYSDetails, KYSRejectionLogs } from '../../types';
import http from '../http';

const BASE_URL = '/api/kys';

export const fetchKYSDetails = (studentId: string) =>
  http.get<ApiResponse<{ kysDetails: IKYSDetails }>>(`${BASE_URL}/student/${studentId}`);

export const updateAadhaar = (studentId: string, data: Record<string, string | Date | boolean>) =>
  http.put<ApiResponse<{ kysDetails: IKYSDetails }>>(
    `${BASE_URL}/student/${studentId}/aadhaar`,
    data,
  );

export const updateCollegeID = (studentId: string, data: Record<string, string | Date | boolean>) =>
  http.put<ApiResponse<{ kysDetails: IKYSDetails }>>(
    `${BASE_URL}/student/${studentId}/college-id-card`,
    data,
  );

export const updateRegistrationCertificate = (
  studentId: string,
  data: Record<string, string | Date | boolean>,
) =>
  http.put<ApiResponse<{ kysDetails: IKYSDetails }>>(
    `${BASE_URL}/student/${studentId}/registration-certificate`,
    data,
  );

export const updateVerificationStatus = (
  studentId: string,
  data: IKYSDetails['verificationStatus'],
) =>
  http.put<ApiResponse<{ kysDetails: IKYSDetails }>>(
    `${BASE_URL}/student/${studentId}/verification-status`,
    data,
  );

export const createRejection = (
  studentId: string,
  data: Pick<KYSRejectionLogs, 'reason' | 'issueFor'>,
) =>
  http.post<ApiResponse<{ kysDetails: IKYSDetails }>>(
    `${BASE_URL}/student/${studentId}/reject`,
    data,
  );

export const updateRejection = (studentId: string, logId: string, isResolved: boolean) =>
  http.patch<ApiResponse<{ kysDetails: IKYSDetails }>>(
    `${BASE_URL}/student/${studentId}/reject/${logId}/resolve`,
    { isResolved },
  );

export const verifyStudent = (studentId: string) =>
  http.post<ApiResponse<{ kysDetails: IKYSDetails }>>(
    `${BASE_URL}/student/${studentId}/mark-as-verified`,
  );
