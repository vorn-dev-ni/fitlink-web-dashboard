import { Provider } from 'jotai'; // Jotai provider
import { RouterProvider } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

// project import
import router from 'routes';
import ScrollTop from 'components/ScrollTop';
import ThemeCustomization from 'themes';

export default function App() {
  // console.log('App Testing Develop');
  return (
    <ThemeCustomization>
      <ScrollTop>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Provider>
            <RouterProvider router={router} />
          </Provider>
        </LocalizationProvider>
      </ScrollTop>
    </ThemeCustomization>
  );
}
