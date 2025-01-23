import Snackbar from '@mui/material/Snackbar';
import { useTheme } from '@mui/material/styles';

const AppSnackBar = ({ title, handleClose, open }) => {
  const theme = useTheme();

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      ContentProps={{
        sx: {
          backgroundColor: theme.palette.error.dark
        }
      }}
      autoHideDuration={2000}
      onClose={handleClose}
      message={title}
      sx={{
        textAlign: 'center'
      }}
      key={'vertical' + 'horizontal'}
    />
  );
};

export default AppSnackBar;
