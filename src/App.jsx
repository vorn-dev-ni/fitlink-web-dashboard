import { Provider } from 'jotai'; // Jotai provider
import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';

import ScrollTop from 'components/ScrollTop';
import ThemeCustomization from 'themes';

export default function App() {
  console.log('App Testing Develop');
  return (
    <ThemeCustomization>
      <ScrollTop>
        <Provider>
          <RouterProvider router={router} />
        </Provider>
      </ScrollTop>
    </ThemeCustomization>
  );
}
