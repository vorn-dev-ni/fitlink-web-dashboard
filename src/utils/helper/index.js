import dayjs from 'dayjs';

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatDateApp = (date) => {
  return dayjs(date).format('DD, MMM YYYY');
};
export const collectionNames = {
  users: 'users',
  submission: 'approval',
  event: 'events'
};
