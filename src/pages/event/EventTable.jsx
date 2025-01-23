import Paper from '@mui/material/Paper';
import SimpleLoading from 'components/SimpleLoading';
import AppTable from 'components/tables/AppTable';
import { useEventsData } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import guidelines from 'themes/styles';

const displayColumns = [
  'Unique ID',
  'Title',
  'Descriptions',
  'Date',
  'Free Entry',
  'Feature',
  'Address',
  'Distance Measure',
  'Schedule',
  'Lat',
  'Lng'
];
const EventTable = () => {
  const [pageState, setPageState] = useState(true);
  const { events, loading } = useEventsData();
  const getRows = useMemo(() => {
    return events;
  }, [events]);

  const getColumns = useMemo(() => {
    if (events?.length && events != undefined) {
      const data = Object.keys(events[0]);
      return data?.map((item, index) => ({
        id: item + '',
        label: index === 0 ? 'Unique ID' : item,
        minWidth: 130,
        isLink: item == 'avatar' ? true : false
      }));
    }

    return displayColumns?.map((item, index) => ({
      id: item + '',
      label: index === 0 ? 'Unique ID' : item,
      minWidth: 130,
      isLink: item == 'avatar' ? true : false
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
    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: guidelines.spacing.py25 }}>
      <AppTable columns={getColumns} rows={getRows} rowsPerPageOptions={[5, 10]} initialRowsPerPage={5} />
    </Paper>
  );
};

export default EventTable;
