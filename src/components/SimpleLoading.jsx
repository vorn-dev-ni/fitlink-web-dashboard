import { CircularProgress } from '@mui/material';
import { Container, Stack } from '@mui/system';
import React from 'react';

const SimpleLoading = ({ height = '100vh' }) => {
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: height
      }}
    >
      <CircularProgress size="3rem" />
    </Container>
  );
};

export default SimpleLoading;
