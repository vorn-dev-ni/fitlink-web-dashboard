import { Popover, Typography } from '@mui/material';

const PopoverDialog = ({ open, handleClose, anchorEl, children }) => {
  return (
    <Popover
      id={'popover'}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      sx={{
        boxShadow: 'none'
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
    >
      {children}
    </Popover>
  );
};

export default PopoverDialog;
