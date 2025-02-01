import { createBrowserRouter, Navigate } from 'react-router-dom';

// project import
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import NotFound from 'pages/error/NotFound';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
  [
    MainRoutes,
    LoginRoutes,
    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <Navigate to={'/404'} />
    }
  ],
  { basename: import.meta.env.VITE_APP_BASE_NAME }
);

export default router;
