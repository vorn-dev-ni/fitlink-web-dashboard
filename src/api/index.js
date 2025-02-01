import axios, { isCancel, AxiosError } from 'axios';
import useSWR from 'swr';
import { AppException } from 'utils/exception';

const axiosInstances = (baseURL = '', timeout = 1500 * 100, signal = new AbortController().signal) => {
  const instance = axios.create({
    baseURL: baseURL,
    timeout: timeout,
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    signal: signal,
    validateStatus: function (status) {
      return status >= 200 && status < 400;
    }
  });

  //This will run in between request and before response

  instance.interceptors.request.use(
    (config) => {
      // Modify request (e.g., adding an auth token to headers)
      console.log('Request Interceptor:', config);
      // Example: Add an Authorization token to headers if available
      const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      // Handle request error
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (response) => {
      // Modify response before passing to .then()
      console.log('Response Interceptor:', response);
      return response;
    },
    (error) => {
      console.error('Response Error:', error);
      if (error.response && error.response.status === 401) {
        console.log('Session expired. Logging out...');
        localStorage.removeItem('authToken');
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

//Handle delete, post, update
export const requesterApi = async (baseURL, data = null, method, timeout, signal) => {
  try {
    const axiosFetcher = axiosInstances(baseURL, timeout, signal);
    const response = await axiosFetcher.request({
      method,
      data: data
    });
    const { data, error } = useSWR('/api/data', response);
    if (response.status >= 300) {
      return response.data;
    }
    return {
      data,
      success,
      error
    };
  } catch (error) {
    handleError(error);
  }
};
//Handle GET
export const fetcherApi = async (baseURL, method, timeout, signal) => {
  try {
    const axiosFetcher = axiosInstances(baseURL, timeout, signal);
    const response = await axiosFetcher.request({
      method
    });
    if (response.status == 200) {
      return response.data;
    }
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error) => {
  const response = error?.response;
  const request = error?.request;
  const config = error?.config;

  if (response) {
    console.log(response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (request) {
    console.log(request);
  } else {
    console.log('Error', error.message);
  }
  if (response.data) {
    throw AppException(response.data);
  }
  throw AppException(error + '');
};
