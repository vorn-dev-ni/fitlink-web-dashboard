import SimpleLoading from 'components/SimpleLoading';
import { Outlet, useNavigation } from 'react-router-dom';

// ==============================|| MINIMAL LAYOUT ||============================== //

export default function SubmissionLayout() {
  const navigation = useNavigation();

  if (navigation.state == 'loading') {
    return <SimpleLoading />;
  }
  return (
    <>
      <Outlet />
    </>
  );
}
