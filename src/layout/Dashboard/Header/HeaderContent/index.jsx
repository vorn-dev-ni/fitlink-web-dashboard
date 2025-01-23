// material-ui
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

// project import
import MobileSection from './MobileSection';
import Notification from './Notification';
import Profile from './Profile';

// project import
import { useLocation } from 'react-router';
import { Breadcrumbs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const location = useLocation();
  const { palette } = useTheme();
  const activePath =
    location.pathname == '/'
      ? 'Dashboard/default'
      : location.pathname?.replace('/', '')[0]?.toUpperCase() + location.pathname?.replace('/', '')?.slice(1);
  return (
    <>
      {/* {!downLG && <Search />} */}
      {!downLG && (
        <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Typography variant="h5" color={palette.primary.main}>
              {activePath || 'Dashboard'}
            </Typography>
          </Breadcrumbs>
        </Box>
      )}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      {/* <IconButton
        component={Link}
        href="https://github.com/codedthemes/mantis-free-react-admin-template"
        target="_blank"
        disableRipple
        color="secondary"
        title="Download Free Version"
        sx={{ color: 'text.primary', bgcolor: 'grey.100' }}
      >
        <GithubOutlined />
      </IconButton> */}

      <Notification />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
