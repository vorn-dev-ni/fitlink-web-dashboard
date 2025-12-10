import dayjs from 'dayjs';

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatDateApp = (date) => {
  return dayjs(date).format('DD, MMM YYYY');
};
export const collectionNames = {
  // eslint-disable-next-line prettier/prettier
  users: 'users',
  // eslint-disable-next-line prettier/prettier
  submission: 'submissions',
  // eslint-disable-next-line prettier/prettier
  event: 'events',
  reports: 'reports'
};

export const resetScroll = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const getFilePathFromUrl = (downloadUrl) => {
  const url = new URL(downloadUrl); // Create a URL object to easily parse the URL
  const path = url.pathname.split('/o/')[1]; // Extract the file path part
  return decodeURIComponent(path);
};

export const trimWhiteSpace = (value) => {
  return value.replace(/\s+/g, '');
};

export const formatNumberToPrice = (region, currency, number) => {
  return Intl.NumberFormat(region, { style: 'currency', currency: currency }).format(number);
};

export const getUserCurrentLocation = (success) => {
  console.log('>>Invoke get current location');
  if (navigator.geolocation) {
    return navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        success(latitude, longitude);
      },
      (error) => {
        console.log('Unable to retrieve your location');
      }
    );
  } else {
    console.log('Geolocation not supported');
  }
};

export const formattedTime = (value) => {
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
};
export const formatToDate = (value, formatter) => {
  return dayjs(value).format(formatter || 'YYYY-MM-DD');
};
