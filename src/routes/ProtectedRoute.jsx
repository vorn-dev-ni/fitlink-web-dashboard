import SimpleLoading from 'components/SimpleLoading';
import { useAuth } from 'hooks';
import { Navigate } from 'react-router-dom';

export const ProtectedRoutes = ({ children }) => {
  const { isLoading, isAuth } = useAuth();
  if (isLoading) {
    return <SimpleLoading />;
  }

  return !isAuth ? <Navigate to="/login" /> : children;
};
