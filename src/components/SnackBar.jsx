import { Alert, Typography } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { useTheme } from '@mui/material/styles';

const AppSnackBar = ({ title, handleClose, open, duration = 6000, state = 'failed' }) => {
  const theme = useTheme();

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      ContentProps={{
        sx: {
          backgroundColor: state == 'failed' ? theme.palette.error.dark : theme.palette.primary.light
        }
      }}
      autoHideDuration={duration}
      onClose={handleClose}
      message={title}
      title={title}
      sx={{
        textAlign: 'center',
        fontSize: 30
      }}
      key={'vertical' + 'horizontal'}
    >
      {state == 'success' ? (
        <Alert
          onClose={handleClose}
          severity="success"
          color="success"
          sx={{ width: '100%', backgroundColor: theme.palette.success.dark, color: theme.palette.success.light }}
        >
          <Typography variant="h6">{title}</Typography>
        </Alert>
      ) : (
        <Alert
          onClose={handleClose}
          severity="error"
          color="error"
          sx={{ width: '100%', backgroundColor: theme.palette.error.dark, color: theme.palette.error.light }}
        >
          <Typography variant="h6">{title}</Typography>
        </Alert>
      )}
    </Snackbar>
  );
};

export default AppSnackBar;
