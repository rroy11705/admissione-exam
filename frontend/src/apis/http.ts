import 'isomorphic-fetch';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_MOCK_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Generate HTTP headers
 */
const getHeader = async (headers = new Headers(), hasFiles = false): Promise<Headers> => {
  const defaultHeaders = new Headers();
  defaultHeaders.append('Accept', 'application/json');
  defaultHeaders.append('Content-Type', 'application/json');

  if (headers) {
    headers.forEach((value: string, key: string) => defaultHeaders.append(key, value));
  }

  if (hasFiles) {
    defaultHeaders.delete('Content-Type');
  }

  const token = Cookies.get('token');

  if (token) {
    defaultHeaders.append('Authorization', `Token ${token}`);
  }

  return defaultHeaders;
};

/**
 * Generate HTTP body
 */
// eslint-disable-next-line no-undef
const getBody = (body?: BodyInit, hasFiles = false) => (hasFiles ? body : JSON.stringify(body));

export class ApiResponseError extends Error {
  code: number = 400;

  constructor(message: string, code: number = 400) {
    super(message || 'Oops! Something went wrong');
    this.name = 'ApiResponseError';
    this.code = code;
  }
}

/**
 * Handle HTTP error
 */
const handleError = (
  httpStatusCode: number,
  response: { message?: string; code?: number } | Error,
) => {
  if (!/^(2|3)[0-9][0-9]$/.test(String(httpStatusCode))) {
    throw new ApiResponseError(response?.message || 'Something went wrong!', httpStatusCode ?? 501);
  }
};

/**
 * Generate Request URL
 */
const getURL = (url: string, options: { baseURL?: string; isMockedURL?: boolean }) => {
  const baseURL = options?.isMockedURL
    ? API_MOCK_URL
    : options?.baseURL
    ? options.baseURL
    : API_URL;

  return baseURL + url;
};

type HTTPOptions = {
  baseURL?: string;
  isMockedURL?: boolean;
  headers?: Headers;
  hasFiles?: boolean;
};

/**
 * HTTP GET Request
 */
const fetchGet = async <T>(url: string, options?: HTTPOptions) => {
  const result = await fetch(
    getURL(url, { isMockedURL: options?.isMockedURL, baseURL: options?.baseURL }),
    {
      method: 'GET',
      headers: await getHeader(options?.headers),
    },
  );

  const response: T = await result.json();
  handleError(result.status, response);
  return response;
};

/**
 * HTTP POST Request
 */
const fetchPost = async <T>(url: string, body?: any, options?: HTTPOptions) => {
  const result = await fetch(
    getURL(url, { isMockedURL: options?.isMockedURL, baseURL: options?.baseURL }),
    {
      method: 'POST',
      headers: await getHeader(options?.headers, options?.hasFiles),
      body: getBody(body, options?.hasFiles),
    },
  );

  const response: T = await result.json();
  handleError(result.status, response);
  return response;
};

/**
 * HTTP PATCH Request
 */
const fetchPatch = async <T>(url: string, body?: any, options?: HTTPOptions) => {
  const result = await fetch(
    getURL(url, { isMockedURL: options?.isMockedURL, baseURL: options?.baseURL }),
    {
      method: 'PATCH',
      headers: await getHeader(options?.headers, options?.hasFiles),
      body: getBody(body, options?.hasFiles),
    },
  );

  const response: T = await result.json();
  handleError(result.status, response);
  return response;
};

/**
 * HTTP PUT Request
 */
const fetchPut = async <T>(url: string, body?: any, options?: HTTPOptions) => {
  const result = await fetch(
    getURL(url, { isMockedURL: options?.isMockedURL, baseURL: options?.baseURL }),
    {
      method: 'PUT',
      headers: await getHeader(options?.headers, options?.hasFiles),
      body: getBody(body, options?.hasFiles),
    },
  );

  const response: T = await result.json();
  handleError(result.status, response);
  return response;
};

/**
 * HTTP DELETE Request
 */
const fetchDelete = async <T>(url: string, body?: any, options?: HTTPOptions) => {
  const result = await fetch(
    getURL(url, { isMockedURL: options?.isMockedURL, baseURL: options?.baseURL }),
    {
      method: 'DELETE',
      headers: await getHeader(options?.headers, options?.hasFiles),
      body: getBody(body, options?.hasFiles),
    },
  );

  const response: T = await result.json();
  handleError(result.status, response);
  return response;
};

const http = {
  get: fetchGet,
  post: fetchPost,
  put: fetchPut,
  patch: fetchPatch,
  delete: fetchDelete,
};

export default http;
