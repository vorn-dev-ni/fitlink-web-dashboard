import { currentUserLocationAtom } from 'atom';
import SimpleLoading from 'components/SimpleLoading';
import { useAuthAction } from 'hooks';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import { getUserCurrentLocation } from 'utils/helper';

// ==============================|| MINIMAL LAYOUT ||============================== //

export default function MinimalLayout() {
  const navigation = useNavigation();
  const { isLoading } = useAuthAction();
  const setCurrentLocation = useSetAtom(currentUserLocationAtom);

  useEffect(() => {
    getUserCurrentLocation((latitude, longitude) => {
      setCurrentLocation({ latitude: latitude, longtitude: longitude });
    });
  }, []);
  if (navigation.state == 'loading' || isLoading) {
    return <SimpleLoading />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
