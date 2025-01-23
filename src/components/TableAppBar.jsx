// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack } from '@mui/system';

// project import
import { EditOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Grid, TextField, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react';
import PopoverDialog from './tables/PopoverDialog';
const TableAppBar = ({ label, handleNavigate }) => {
  const { palette } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <Grid
      sx={{
        marginTop: 3
      }}
      container
      alignItems={'center'}
      justifyContent={'center'}
      rowGap={2}
    >
      <PopoverDialog open={open} anchorEl={anchorEl} handleClose={handleClose}>
        <Typography sx={{ p: 2 }}>Coming Soon !!!</Typography>
      </PopoverDialog>
      <Grid item xs={12} md={6} lg={6}>
        <Stack
          direction={'row'}
          alignItems={'center'}
          // mt={guidelines.spacing.py25}
          spacing={{
            xs: 2,
            lg: 3
          }}
        >
          <TextField
            label="Search"
            fullWidth
            // id="fullWidth"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }}
          />
          <Button
            sx={{ width: 120 }}
            style={{
              backgroundColor: palette.primary.light
            }}
            onClick={handleClick}
            variant="contained"
            endIcon={<FilterOutlined />}
          >
            Filter
          </Button>
        </Stack>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'flex-end'}>
          <Button
            sx={{
              width: {
                xs: '100%',
                sm: '100%',
                md: 'auto'
              }
            }}
            onClick={handleNavigate}
            variant="outlined"
            endIcon={<EditOutlined />}
          >
            Create {label}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default TableAppBar;
