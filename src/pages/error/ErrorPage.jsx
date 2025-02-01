import { Box, Button, Typography, useTheme } from '@mui/material';
import ErrorNotFoundSvg from 'assets/images/logo/cat.png';
import { useRouteError } from 'react-router';

const NotFound = () => {
  const theme = useTheme();
  const error = useRouteError();

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
      <img
        src={ErrorNotFoundSvg}
        alt="Facebook"
        style={{
          width: 300,
          height: 300
        }}
      />
      <Typography variant="h3" gutterBottom color={theme.palette.error.dark}>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="h5" color={theme.palette.error.dark} gutterBottom>
        Error caught by ----- {error?.toString()} ------
      </Typography>
      <Button
        variant="contained"
        color="error"
        sx={{ marginTop: theme.spacing(2), borderRadius: 100 }}
        onClick={() => (window.location.href = '/')}
      >
        Go Back Home
      </Button>
    </Box>
  );
};

export default NotFound;
