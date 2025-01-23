// ==============================|| THEME CONFIG  ||============================== //

const Environment = {
  APP_API_KEY_DEV: import.meta.env.VITE_REACT_APP_API_KEY_DEV,
  AUTH_DOMAIN_DEV: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN_DEV,
  PROJECT_ID_DEV: import.meta.env.VITE_REACT_APP_PROJECT_ID_DEV,
  STORAGE_BUCKET_DEV: import.meta.env.VITE_REACT_APP_STORAGE_BUCKET_DEV,
  MESSAGING_SENDER_ID_DEV: import.meta.env.VITE_REACT_APP_MESSAGING_SENDER_ID_DEV,
  APP_ID_DEV: import.meta.env.VITE_REACT_APP_APP_ID_DEV,
  APP_MEASUREMENT_ID: import.meta.env.VITE_REACT_APP_APP_MEASUREMENT_ID,
};


const config = {
  defaultPath: '/dashboard/default',
  fontFamily: `'Public Sans', sans-serif`,
  i18n: 'en',
  miniDrawer: false,
  container: true,
  mode: 'light',
  presetColor: 'default',
  themeDirection: 'ltr',
  AppEnv:{...Environment}
};


export default config;
export const drawerWidth = 260;

export const twitterColor = '#1DA1F2';
export const facebookColor = '#3b5998';
export const linkedInColor = '#0e76a8';
