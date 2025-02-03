import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import SimpleLoading from 'components/SimpleLoading';
import AppTable from 'components/tables/AppTable';
import PopoverDialog from 'components/tables/PopoverDialog';
import { useSubmissions } from 'hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import guidelines from 'themes/styles';
import useStyles from '../Submission.style';
import { useTheme } from '@mui/material/styles';

const displayColumns = ['Unique ID', 'Email', 'Name', 'Status', 'Document', 'Date'];
export default function SubmitTables({ formEvents, loading }) {
  const [pageState, setPageState] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const theme = useTheme();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const getColorStatus = useCallback((item) => {
    switch (item) {
      case 'pending':
        return 'red';
      case 'completed':
        return 'green';
      default:
        return theme.palette.common.black;
    }
  }, []);
  const getRows = useMemo(() => {
    return formEvents.map((form) => {
      return {
        ...form,
        color: getColorStatus(form?.status)
      };
    });
  }, [formEvents]);

  const getColumns = useMemo(() => {
    if (formEvents?.length && formEvents != undefined && displayColumns.length) {
      const data = Object.keys(formEvents[0]);
      return data?.map((item, index) => ({
        id: item + '',
        label: displayColumns[index],
        minWidth: 100,

        isLink: ['WebSite', 'Document'].includes(displayColumns[index]),
        document: ['Document'].includes(displayColumns[index])
      }));
    }
    return displayColumns?.map((item, index) => ({
      id: item + '',
      label: index === 0 ? 'Unique ID' : item,
      minWidth: 100,
      isLink: ['WebSite', 'Document'].includes(displayColumns[index]),
      document: ['Document'].includes(displayColumns[index])
    }));
  }, [formEvents, displayColumns]);
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
              <Typography variant="body1">Approved</Typography>
              <CheckOutlined />
            </Stack>
          </Button>
          <Button
            sx={{
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              '&:hover': {
                backgroundColor: '#fbc3bc',
                overflow: 'hidden',
                borderRadius: '0px'
              }
            }}
            onClick={handleClose}
            className={classes.button}
            variant="text"
          >
            <Stack direction={'row-reverse'} alignItems={'center'} spacing={1} justifyContent={'flex-start'}>
              <Typography variant="body1" color={'red'}>
                Reject
              </Typography>
              <CloseOutlined style={{ color: 'red' }} />
            </Stack>
          </Button>
        </Stack>
      </PopoverDialog>
      <AppTable columns={getColumns} rows={getRows} rowsPerPageOptions={[5, 10]} handleClickAction={handleClick} initialRowsPerPage={5} />
    </Paper>
  );
}
