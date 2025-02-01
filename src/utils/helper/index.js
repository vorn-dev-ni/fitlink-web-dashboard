import dayjs from 'dayjs';

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatDateApp = (date) => {
  return dayjs(date).format('DD, MMM YYYY');
};
export const collectionNames = {
  users: 'users',
  submission: 'submissions',
  event: 'events'
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
