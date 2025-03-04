import { lazy, Suspense } from 'react';

// Project imports
import Loadable from 'components/Loadable';
import SimpleLoading from 'components/SimpleLoading';
import Dashboard from 'layout/Dashboard';
import { Navigate } from 'react-router';
import { ProtectedRoutes } from './ProtectedRoute';

// Lazy-loaded components
const Color = Loadable(lazy(() => import('pages/components/color')));
const Typography = Loadable(lazy(() => import('pages/components/typography')));
const Shadow = Loadable(lazy(() => import('pages/components/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const ErrorPage = Loadable(lazy(() => import('pages/error/ErrorPage')));

// Sample pages
const EventCreateEdit = Loadable(lazy(() => import('pages/event/form')));
const UserPage = Loadable(lazy(() => import('pages/users/index')));
const EventPage = Loadable(lazy(() => import('pages/event')));
const SubmitPage = Loadable(lazy(() => import('pages/submissions')));
const UserCreateEdit = Loadable(lazy(() => import('pages/users/form')));

// Submission pages
const SubmissionCreatePage = Loadable(lazy(() => import('pages/submissions/form/index')));
const SubmissionViewPage = Loadable(lazy(() => import('pages/submissions/components/SubmissionViewPage'))); // Import the new component

// Layouts
const SubmissionLayout = Loadable(lazy(() => import('layout/Submission')));
const EventLayout = Loadable(lazy(() => import('layout/Event')));

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
      element: <EventLayout />,
      children: [
        {
          path: '',
          element: <UserPage />
        },
        {
          path: 'create',
          element: <UserCreateEdit />
        },
        {
          path: ':id/edit',
          element: <UserCreateEdit />
        }
      ]
    },
    {
      path: 'events',
      element: <EventLayout />,
      children: [
        {
          path: '',
          element: <EventPage />
        },
        {
          path: 'create',
          element: <EventCreateEdit />
        },
        {
          path: ':id/edit',
          element: <EventCreateEdit />
        }
      ]
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
          path: 'view', // New route for viewing submissions
          element: <SubmissionViewPage />
        },
        {
          path: 'edit',
          element: <SubmissionCreatePage />
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