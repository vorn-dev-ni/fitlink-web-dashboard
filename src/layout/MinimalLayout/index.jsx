import SimpleLoading from 'components/SimpleLoading';
import { useAuthAction } from 'hooks';
import { Outlet, useNavigation } from 'react-router-dom';

// ==============================|| MINIMAL LAYOUT ||============================== //

export default function MinimalLayout() {
  const navigation = useNavigation();
  const { isLoading } = useAuthAction();

  if (navigation.state == 'loading' || isLoading) {
    return <SimpleLoading />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
