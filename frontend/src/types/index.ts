import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import {
  BUSINESS_TYPES,
  KYS_STEP,
  KYS_VERIFICATION_STATUS,
  MERCHANT_STAFF_ROLES,
  PAYMENT_METHODS,
  PLANS,
} from './enums';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

declare module 'yup' {
  interface StringSchema {
    stripEmptyString(): StringSchema;
  }
}

export interface MongooseDocument {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export type IUpload = {
  path: string;
  mimeType: string;
  size: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type IPaginator = {
  index: number;
  previous: number | null;
  next: number | null;
  limit: number;
  offset: number;
  count: number;
  pages: number;
};

export interface IAddress {
  formattedAddress: string;
  city: string;
  state: string;
  country: string;
  zipCode?: number;
  locality?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface RequestCoordinates {
  lat: number;
  lng: number;
}

export interface RequestAddress extends Omit<IAddress, 'coordinates'> {
  coordinates: RequestCoordinates;
}

export interface IContactNumber {
  countryCode: string;
  number: string;
}

export interface IName {
  firstName?: string;
  lastName?: string;
  middleName?: string;
}

export interface ICategory {
  _id: string;
  name: string;
  image?: IUpload;
}

export type CategoryRequest = Omit<ICategory, '_id' | 'image'> & { image?: string };

export interface IMerchant extends MongooseDocument {
  uniqueId: string;
  name: string;
  email?: string;
  websiteLink?: string;
  redirectionLink?: string;
  address?: IAddress;
  logo?: IUpload;
  owner?: IName;
  description?: string;
  gstNumber?: string;
  foodLicense?: string;
  tradeLicense?: string;
  businessType?: BUSINESS_TYPES;
  plans?: PLANS;
  scoins?: number;
  publicContactNumber?: IContactNumber;
  privateContactNumber?: IContactNumber;
  isVerified?: boolean;
  isOnline?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  category?: Array<ICategory>;
  storeLocations?: Array<string>;
  discount: number;
}

export type RequestMerchant = Omit<IMerchant, 'logo' | '_id'> & {
  logo: IUpload | string;
};

export interface IMerchantStoreLocation extends MongooseDocument {
  uniqueId: string;
  merchantId?: string;
  name: string;
  email?: string;
  address: IAddress;
  owner?: IName;
  publicContactNumber?: IContactNumber;
  privateContactNumber?: IContactNumber;
  description?: string;
  plans?: PLANS;
  scoins?: number;
  costForOne?: number;
  listings?: Array<string>;
  isVerified?: boolean;
  isActive?: boolean;
  category?: Array<string>;
  foodLicense?: string;
  tradeLicense?: string;
  gstNumber?: string;
}

export type RequestMerchantStoreLocation = Omit<
  IMerchantStoreLocation,
  '_id' | 'createdAt' | 'updatedAt' | 'merchantId' | 'address'
> & {
  address: RequestAddress;
};

export interface IUser {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  contact: string;
  date_of_birth: string | null;
  address_line_1: string;
  address_line_2: string;
  state: string;
  city: string;
  zip: string;
  is_admin: boolean;
}

export interface IAcademicSession {
  startYear: string;
  endYear: string;
}
export interface IStudentLead {
  _id?: string;
  fullName?: string;
  email?: string;
  collegeEmail?: string;
  contactNumber?: IContactNumber;
  institution?: string;
  city?: string;
  state?: string;
  academicSession?: IAcademicSession;
}

export interface IJobApplication {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: IContactNumber;
  role: string;
  cvLink?: string;
}

export interface IContactUs {
  _id: string;
  email: string;
}

export enum GENDER_TYPE {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
}

export enum AUTH_TYPE {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export interface IInstitution extends MongooseDocument {
  name: string;
  establishedAt?: Date;
  logo?: string;
  currentDirector?: string;
  helpline?: IContactNumber;
  website?: string;
  address?: IAddress;
  isVerified: boolean;
  board?: string;
  affiliatedTo?: string;
}

export type RequestInstitution = Omit<IInstitution, '_id'>;

export interface IStudent {
  scontoId?: string;
  _id: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: GENDER_TYPE;
  dob?: Date;
  profilePicture?: string;
  initialVerificationWith?: AUTH_TYPE;
  email?: string;
  institution?: IInstitution;
  academicSession?: IAcademicSession;
  contactNumber?: IContactNumber;
  address?: IAddress;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isVerified?: boolean;
  isRegistered?: boolean;
  isTribePartner?: boolean;
  emailVerificationHash?: string;
  otpToken?: string;
  resetToken?: string;
  referralCode?: string;
  registrationReferralCode?: string;
  password?: string;
  language?: string;
  scoins?: number;
  deactivated?: boolean;
}

export interface IAdditionalDocument {
  key: string;
  label: string;
  file: string;
}

export interface KYSRejectionLogs extends MongooseDocument {
  reason: string;
  date: Date;
  issueFor: KYS_STEP;
  rejectedBy: string;
  resolved: boolean;
}

export interface IKYSDetails extends MongooseDocument {
  // Student
  student: string;
  // Aadhaar
  aadhaarNumber?: string;
  aadhaarDocument?: string;
  aadhaarDetails?: {
    birthDate: string;
    gender: string;
    isPictureMatching: boolean;
    isNameMatching: boolean;
    isAadhaarNumberMatching: boolean;
  };
  // Registration Certificate
  registrationCertificateNumber?: string;
  registrationCertificateDocument?: string;
  registrationCertificateDetails?: Record<string, string | boolean>;
  // College ID Card
  collegeIdCardNumber?: string;
  collegeIdCardDocument?: string;
  collegeIdCardDetails?: Record<string, string | boolean>;
  // Additional Documents
  additionalDocuments?: Array<IAdditionalDocument>;
  // 20s Video KYS
  videoKYSDocument?: string;
  videoKYSTranscript?: string;
  // College Email
  collegeEmail?: string;
  // Scores & Status
  status?: KYS_VERIFICATION_STATUS;
  verificationScore?: number; // Numeric score to total verification score
  verificationPercentage?: number; // Numeric score to total verification percentage, value between 0 to 1
  verificationStatus: {
    isAadhaarVerified: boolean;
    isRegistrationCertificateVerified: boolean;
    isCollegeIdCardVerified: boolean;
    isAdditionalDocumentsVerified: boolean;
    isVideoKYSDocumentVerified: boolean;
    isCollegeEmailVerified: boolean;
  };
  verificationRejectionLogs?: Array<KYSRejectionLogs>;
  expiryDate?: Date;
}

export interface IMerchantStaff extends MongooseDocument {
  firstName: string;
  lastName?: string;
  email: string;
  role: MERCHANT_STAFF_ROLES;
  merchant?: string | null;
  merchantStore?: string | null;
}

export type IMerchantStaffWithMerchant = IMerchantStaff & {
  merchant?: IMerchant;
  merchantStore?: IMerchantStoreLocation;
};

export type IMerchantStaffCreateRequest = Omit<
  IMerchantStaff,
  'merchant' | 'merchantStore' | '_id' | 'createdAt' | 'updatedAt'
>;

export interface ISocialEvent {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  image: IUpload;
  paymentMethods: Array<PAYMENT_METHODS>;
  upiId?: string;
  instructions?: string;
  actualPrice: string;
  discountPercentage: string;
  discountedPrice: string;
}

export type RequestSocialEvent = Omit<ISocialEvent, 'image' | '_id'> & {
  image: string;
};

export interface ITopics {
  _id: string;
  name: string;
  subject: string;
}
export type RequestTopic = Omit<ITopics, 'topics'>;

export interface ISubject {
  _id: string;
  name: string;
  topics: Array<ITopics>;
}

export type RequestSubject = Omit<ISubject, 'topics'>;

export interface ISocialEventTransaction {
  _id: string;
  event: ISocialEvent;
  student: IStudent;
  transactionId?: string;
  isTransactionValid: boolean;
  transactionProof: IUpload;
}

export type RequestSocialEventTransaction = {
  event: string;
  student: string;
  transactionId?: string;
  isTransactionValid: boolean;
  transactionProof: string;
};
