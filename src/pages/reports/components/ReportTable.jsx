import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import AlertDialog from 'components/AlertDialog';
import SimpleLoading from 'components/SimpleLoading';
import AppTable from 'components/tables/AppTable';
import PopoverDialog from 'components/tables/PopoverDialog';
import useStyles from 'pages/submissions/Submission.style';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import guidelines from 'themes/styles';
const displayColumns = ['Type', 'Post Id', 'Reason'];
const ReportTable = ({ onDelete, onEdit, events, loading, hightLightText }) => {
  const [pageState, setPageState] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [eventData, setEventData] = useState(null);
  const open = Boolean(anchorEl);
  const classes = useStyles();
  const handleClick = (event, data) => {
    // alert(JSON.stringify(data));
    setAnchorEl(event.currentTarget);
    setEventData(data);
  };

  const handlePressTable = useCallback((data) => {
    const { id } = data;
    navigate(`${id}/edit`);
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const getRows = useMemo(() => {
    return events;
  }, [events]);

  const getColumns = useMemo(() => {
    if (events?.length && events != undefined) {
      const data = Object.keys(events[0]);
      return data?.map((item, index) => ({
        id: item + '',
        label: displayColumns[index],
        minWidth: 130,
        isAvatar: item == 'feature' ? true : false,
        hightLightText
      }));
    }

    return displayColumns?.map((item, index) => ({
      id: item + '',
      label: index === 0 ? 'Unique ID' : item,
      minWidth: 130,
      isAvatar: item == 'feature' ? true : false
    }));
  }, [events, displayColumns]);
  useEffect(() => {
    let timeOut;
    if (!loading) {
      timeOut = setTimeout(() => {
        setPageState(loading);
      }, 400);
    }
    return () => clearTimeout(timeOut);
  }, [loading]);
  if (pageState) {
    return <SimpleLoading height="50vh" />;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'scroll', marginTop: guidelines.spacing.py25 }}>
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
              onEdit(eventData);
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
          console.log('delete on delete', eventData);
          onDelete(eventData);
        }}
        message="Please confirm your action to delete this item!!!"
        open={showDialog}
      />

      <AppTable
        onPressTable={handlePressTable}
        handleClickAction={handleClick}
        columns={getColumns}
        rows={getRows}
        rowsPerPageOptions={[5, 10]}
        initialRowsPerPage={5}
      />
    </Paper>
  );
};

export default ReportTable;
