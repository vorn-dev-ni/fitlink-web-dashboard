import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import ErrorNotFoundSvg from 'assets/images/icons/error.svg';

const NotFound = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
      }}
    >
      <img src={ErrorNotFoundSvg} alt="Facebook" />
      <Typography variant="h3" gutterBottom>
        Oop
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        The page you are looking for does not exist or has been moved.
      </Typography>
      <Button variant="contained" color="primary" sx={{ marginTop: theme.spacing(2) }} onClick={() => (window.location.href = '/')}>
        Go Back Home
      </Button>
    </Box>
  );
};

export default NotFound;
