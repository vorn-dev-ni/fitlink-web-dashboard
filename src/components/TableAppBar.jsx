// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack } from '@mui/system';

// project import
import { EditOutlined, SearchOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { Button, Grid, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
const TableAppBar = ({ label, handleNavigate, onClickSort, handleChangeText }) => {
  const { palette } = useTheme();

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
            onChange={handleChangeText}
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
            style={{
              color: palette.primary.light,
              padding: 7
            }}
            onClick={onClickSort}
            variant="outlined"
            color="inherit"
            endIcon={<SortAscendingOutlined />}
          >
            Sort
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
