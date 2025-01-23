import SimpleLoading from 'components/SimpleLoading';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

// ==============================|| MINIMAL LAYOUT ||============================== //

export default function SubmissionLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}
