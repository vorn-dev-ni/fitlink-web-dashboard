import { useEffect } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';

// project import
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import Loader from 'components/Loader';
import Drawer from './Drawer';
import Header from './Header';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import SimpleLoading from 'components/SimpleLoading';
import { Card } from '@mui/material';
import { getUserCurrentLocation } from 'utils/helper';
import { useSetAtom } from 'jotai';
import { currentUserLocationAtom } from 'atom';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const { menuMasterLoading } = useGetMenuMaster();
  const setCurrentLocation = useSetAtom(currentUserLocationAtom);
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  const navigation = useNavigation();

  useEffect(() => {
    handlerDrawerOpen(!downXL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL]);

  useEffect(() => {
    getUserCurrentLocation((latitude, longitude) => {
      setCurrentLocation({ latitude: latitude, longtitude: longitude });
    });
  }, []);

  if (menuMasterLoading) return <Loader />;
  if (navigation.state == 'loading') {
    return <SimpleLoading />;
  }
  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header />
      <Drawer />

      <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        <Breadcrumbs navigation={navigation} title />
        <Card bgcolor={'white'} sx={{ height: '100vh', padding: 4, overflow: 'scroll' }}>
          <Box>
            <Outlet />
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
