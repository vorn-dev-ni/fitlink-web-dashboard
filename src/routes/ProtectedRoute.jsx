import SimpleLoading from 'components/SimpleLoading';
import { useAuthAction } from 'hooks';
import { Navigate } from 'react-router-dom';

export const ProtectedRoutes = ({ children }) => {
  const { isLoading, isAuth } = useAuthAction();
  if (isLoading) {
    return <SimpleLoading />;
  }

  return !isAuth ? <Navigate to="/login" /> : children;
};
