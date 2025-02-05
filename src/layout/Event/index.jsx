import { AppBar, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

// ==============================|| EVENT LAYOUT ||============================== //

export default function EventLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}
