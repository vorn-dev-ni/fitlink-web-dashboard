import { requesterApi, fetcherApi } from 'api';
export const useApi = async (url) => {
  return {
    requesterApi,
    fetcherApi
  };
};
