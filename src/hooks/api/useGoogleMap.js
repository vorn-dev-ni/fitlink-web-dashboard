import { useApi } from 'api';
import config from 'utils/config/config';
const abortcontroller = new AbortController();
export const useGoogleMap = ({ lat, lng }) => {
  const baseUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat || -3.745},${lng || -38.523}&key=${config.AppEnv.GOOGLE_MAP_API}`;
  const { useFetchData, requestApiData } = useApi(150000, abortcontroller.signal);
  const { Loading, data, error, success } = useFetchData(baseUrl);
  const fullAddress = data?.[0]?.formatted_address || null;

  return {
    Loading,
    data: fullAddress,
    lat: lat,
    lng: lng,
    error,
    success
  };
};
