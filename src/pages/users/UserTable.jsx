import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import SimpleLoading from 'components/SimpleLoading';
import AppTable from 'components/tables/AppTable';
import PopoverDialog from 'components/tables/PopoverDialog';
import { useUsersCollection } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import guidelines from 'themes/styles';
import useStyles from './User.style';
const displayColumns = ['Unique ID', 'Email', 'FullName', 'Provider', 'Role'];
export default function UserTables() {
  const [pageState, setPageState] = useState(true);
  const { users, loading } = useUsersCollection();
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const getRows = useMemo(() => {
    return users;
  }, [users]);
  const getColumns = useMemo(() => {
    if (users?.length && users != undefined) {
      const data = Object.keys(users[0]);
      return data?.map((item, index) => ({
        id: item + '',
        label: displayColumns[index],
        minWidth: 50
        // isLink: ['Avatar Image'].includes(displayColumns[index])
      }));
    }
    return displayColumns?.map((item, index) => ({
      id: item + '',
      label: index,
      minWidth: 50
      // isLink: ['Avatar Image'].includes(displayColumns[index])
    }));
  }, [users, displayColumns]);
  useEffect(() => {
    let timeOut;
    if (!loading) {
      timeOut = setTimeout(() => {
        setPageState(loading);
      }, 200);
    }
    return () => clearTimeout(timeOut);
  }, [loading]);
  if (pageState) {
    return <SimpleLoading height="50vh" />;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: guidelines.spacing.py25 }}>
      <PopoverDialog open={open} anchorEl={anchorEl} handleClose={handleClose}>
        <Stack className={classes.stackContainer}>
          <Button
            onClick={handleClose}
            className={classes.button}
            variant="text"
            sx={{
              alignItems: 'flex-start',
              justifyContent: 'flex-start'
            }}
          >
            <Stack direction={'row-reverse'} alignItems={'center'} justifyContent={'flex-start'} spacing={1}>
              <Typography variant="body1">Delete</Typography>
              <DeleteOutlined />
            </Stack>
          </Button>
          <Button
            sx={{
              alignItems: 'flex-start',
              justifyContent: 'flex-start'
            }}
            onClick={handleClose}
            className={classes.button}
            variant="text"
          >
            <Stack direction={'row-reverse'} alignItems={'center'} spacing={1} justifyContent={'flex-start'}>
              <Typography variant="body1">Edit</Typography>
              <EditOutlined />
            </Stack>
          </Button>
        </Stack>
      </PopoverDialog>
      <AppTable columns={getColumns} rows={getRows} rowsPerPageOptions={[5, 10]} initialRowsPerPage={5} handleClickAction={handleClick} />
    </Paper>
  );
}
