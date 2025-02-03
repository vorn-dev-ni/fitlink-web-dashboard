// material-ui

// project import
// project import
import { DatabaseOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TableAppBar from 'components/TableAppBar';
import AppPageHeader from 'pages/components/AppPageHeader';
import EventTable from './components/EventTable';
import { useEventAction, useEventsData } from 'hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { resetScroll } from 'utils/helper';
import AppSnackBar from 'components/SnackBar';

export default function EventPage() {
  const { palette } = useTheme();
  const [sortBy, setSortBy] = useState('desc');
  const [showError, setShowError] = useState(false);
  const [hightLightText, setHighlightText] = useState('');
  const { events, loading, error: errorEvents } = useEventsData(sortBy);
  const { handleDeleteEvent } = useEventAction();
  const [localEventState, setLocalEventState] = useState([]);
  const navigate = useNavigate();
  const mutateEventState = useMemo(() => {
    return events.filter((item) => item.eventTitle?.toLowerCase()?.includes(hightLightText?.toLowerCase()));
  }, [events, hightLightText]);
  const handleChange = useCallback(
    (e) => {
      const text = e.target.value;
      setHighlightText(text?.trim());
    },
    [events]
  );
  const onClickDelete = useCallback(async (data) => {
    await handleDeleteEvent(data.id, data.avatar);
    setOpen(true);
  }, []);

  const onClickEdit = useCallback((data) => {
    const { id } = data;
    navigate(`${id}/edit`);
  }, []);

  useEffect(() => {
    setLocalEventState(mutateEventState);
  }, [mutateEventState]);
  useEffect(() => {
    resetScroll();
  }, []);
  useEffect(() => {
    if (errorEvents) {
      setShowError(true);
    }
  }, [errorEvents]);

  return (
    <Box component={'div'}>
      <AppSnackBar
        title={errorEvents ?? 'Successfully deleted'}
        state={errorEvents ? 'failed' : 'success'}
        open={showError}
        handleClose={() => {
          setShowError(false);
        }}
      />
      <AppPageHeader title={'All Events'}>
        <DatabaseOutlined
          style={{
            fontSize: '25px',
            color: palette.primary.light
          }}
        />
      </AppPageHeader>
      <TableAppBar
        onClickSort={() => {
          const result = sortBy == 'desc' ? 'asc' : 'desc';
          setSortBy(result);
        }}
        handleNavigate={() => {
          navigate('create');
        }}
        handleChangeText={handleChange}
        label={'Events'}
      />
      <EventTable
        hightLightText={hightLightText}
        events={localEventState}
        loading={loading}
        onEdit={onClickEdit}
        onDelete={onClickDelete}
      />
    </Box>
  );
}
