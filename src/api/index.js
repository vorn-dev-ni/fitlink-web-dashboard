import axios from 'axios';
import useSWR from 'swr';

const axiosInstances = (baseURL, timeout = 1500 * 100, signal = new AbortController().signal, method) => {
  console.log('>>Request uri is ', baseURL, 'Time out', timeout, 'Method', method);
  const instance = axios.create({
    baseURL: baseURL,
    timeout: timeout,
    method: method,
    headers: null,
    signal: signal,
    validateStatus: function (status) {
      return status >= 200 && status < 400;
    }
  });

  //This will run in between request and before response

  instance.interceptors.request.use(
    (config) => {
      // console.log('Request Interceptor:', config);
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

  instance.interceptors.response.use(
    (response) => {
      // console.log('Response Interceptor:', response);
      return response;
    },
    (error) => {
      console.error('Response Error:', error);
      // if (error.response && error.response.status === 401) {
      //   console.log('Session expired. Logging out...');
      //   localStorage.removeItem('authToken');
      // }
      const errorMessage = handleError(error);
      return Promise.reject(errorMessage);
    }
  );

  return instance;
};
export const useApi = (timeout, signal) => {
  const requesterApi = async (baseURL, data, method) => {
    try {
      console.log('>>Params data is', data, 'Method', method);
      const axiosFetcher = axiosInstances(baseURL, timeout, signal, method);
      const response = await axiosFetcher.request({
        method,
        data: data ?? {}
      });
      if (response.status < 300) {
        return response.data;
      }
    } catch (error) {
      handleError(error);
    }
  };
  //Handle GET
  const fetcherApi = async (baseURL) => {
    try {
      const axiosFetcher = axiosInstances(baseURL, timeout, signal, 'GET');
      const response = await axiosFetcher.request({
        method: 'GET'
      });
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      handleError(error);
    }
  };

  const useFetchData = (url, config) => {
    const { data, error, isLoading, mutate } = useSWR(url, fetcherApi, {
      // revalidateOnFocus: true, // Revalidate data when window gains focus
      // revalidateOnReconnect: true, // Revalidate data when network is reconnected
      refreshInterval: 0, // Disable automatic interval refetching
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      ...config
    });
    if (data)
      return {
        data: data.results,
        success: true,
        error,
        isLoading
      };

    return {
      data: [],
      success: false,
      error,
      isLoading
    };
  };
  const requestApiData = async (url, data, method) => {
    const response = await requesterApi(url, data, method);
    if (response?.data) {
      return response?.data;
    }
  };

  return {
    requestApiData,
    useFetchData
  };
};

//Handle delete, post, update

const handleError = (error) => {
  //Customize error message
  const response = error?.response;
  const request = error?.request;
  const config = error?.config;

  if (response) {
    // console.log(response?.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (request) {
    console.log(request);
  } else {
    console.log('Error', error);
  }
  if (response?.data) {
    return response?.data;

    // throw AppException(response.data);
  }
  return error?.toString();
  // throw AppException(error + '');
};
