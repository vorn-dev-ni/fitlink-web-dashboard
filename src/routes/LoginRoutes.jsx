import { lazy, Suspense } from 'react';

// project import
import Loadable from 'components/Loadable';
import SimpleLoading from 'components/SimpleLoading';
import MinimalLayout from 'layout/MinimalLayout';
import { Navigate } from 'react-router';
const ErrorPage = Loadable(lazy(() => import('pages/error/ErrorPage')));

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));
// const AuthRegister = Loadable(lazy(() => import('pages/authentication/register')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  errorElement: <ErrorPage />,
  children: [
    {
      path: '/login',
      element: (
        <Suspense fallback={<SimpleLoading />}>
          <AuthLogin />
        </Suspense>
      )
    },
    {
      path: '*',
      element: <Navigate to={'/404'} />
    }
  ]
};

export default LoginRoutes;
