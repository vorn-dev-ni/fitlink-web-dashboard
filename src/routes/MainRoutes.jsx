import { lazy, Suspense } from 'react';

// project import
import Loadable from 'components/Loadable';
import SimpleLoading from 'components/SimpleLoading';
import Dashboard from 'layout/Dashboard';
import SubmissionLayout from 'layout/Submission';
import { Navigate } from 'react-router';
import { ProtectedRoutes } from './ProtectedRoute';
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const ErrorPage = Loadable(lazy(() => import('pages/error/ErrorPage')));

// render - sample page

const UserPage = Loadable(lazy(() => import('pages/users/UserPage')));
const EventPage = Loadable(lazy(() => import('pages/event/EventPage')));
const SubmitPage = Loadable(lazy(() => import('pages/submissions/SubmitPage')));
const UserCreateEdit = Loadable(lazy(() => import('pages/users/id/UserCreateEdit')));

const SubmissionCreatePage = Loadable(lazy(() => import('pages/submissions/SubmissionCreate')));

const SubmissionEditViewPage = Loadable(lazy(() => import('pages/submissions/SubmissionEditView')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  errorElement: <ErrorPage />,
  element: (
    <Suspense fallback={<SimpleLoading />}>
      <ProtectedRoutes>
        <Dashboard />
      </ProtectedRoutes>
    </Suspense>
  ),
  // loader: protectedRouteLoader,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'users',
      children: [
        {
          path: '',
          element: <UserPage />
        },
        {
          path: ':id/edit',
          element: <UserCreateEdit />
        },
        {
          path: 'create',
          element: <UserCreateEdit />
        }
      ]
    },
    {
      path: 'events',
      element: <EventPage />
    },
    {
      path: 'submissions',
      element: <SubmissionLayout />,
      children: [
        {
          path: '',
          element: <SubmitPage />
        },
        {
          path: 'create',
          element: <SubmissionCreatePage />
        },
        {
          path: 'edit',
          element: <SubmissionEditViewPage />
        },
        {
          path: '*',
          element: <Navigate to={'/404'} />
        }
      ]
    },
    {
      path: '*',
      element: <Navigate to={'/404'} />
    }
  ]
};

export default MainRoutes;
