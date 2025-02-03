import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import AlertDialog from 'components/AlertDialog';
import SimpleLoading from 'components/SimpleLoading';
import AppTable from 'components/tables/AppTable';
import PopoverDialog from 'components/tables/PopoverDialog';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import guidelines from 'themes/styles';
import useStyles from '../User.style';
const displayColumns = ['Unique ID', 'Email / Telephone', 'Full Name', 'Provider', 'Role'];
function UserTables({ onDelete, onEdit, users, loading, hightLightText }) {
  const [pageState, setPageState] = useState(true);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [data, setData] = useState(null);
  const open = Boolean(anchorEl);
  const classes = useStyles();
  const handleClick = (event, data) => {
    setAnchorEl(event.currentTarget);
    setData(data);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const getRows = useMemo(() => {
    return users;
  }, [users]);
  const handlePressTable = useCallback((data) => {
    const { id } = data;
    navigate(`${id}/edit`);
  }, []);
  const getColumns = useMemo(() => {
    if (users?.length && users != undefined) {
      const data = Object.keys(users[0]);
      return data?.map((item, index) => ({
        id: item + '',
        label: displayColumns[index],
        minWidth: 50,
        hightLightText: hightLightText
      }));
    }
    return displayColumns?.map((item, index) => ({
      id: item + '',
      label: item,
      minWidth: 50
    }));
  }, [users, displayColumns, hightLightText]);
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
            onClick={() => {
              handleClose();
              setShowDialog((pre) => !pre);
              // onDelete(id);
            }}
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
            onClick={() => {
              handleClose();
              onEdit(data);
            }}
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
      <AlertDialog
        onClose={() => setShowDialog((pre) => !pre)}
        title={'Are you sure?'}
        onConfirm={() => {
          setShowDialog((pre) => !pre);
          console.log('delete on delete', data);
          onDelete(data);
        }}
        message="Please confirm your action to delete this item!!!"
        open={showDialog}
      />
      <AppTable
        onPressTable={handlePressTable}
        columns={getColumns}
        rows={getRows}
        rowsPerPageOptions={[5, 10]}
        initialRowsPerPage={5}
        handleClickAction={handleClick}
      />
    </Paper>
  );
}
export default memo(UserTables);
