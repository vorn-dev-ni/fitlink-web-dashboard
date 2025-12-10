// material-ui
// project import
import { Box } from '@mui/material';
import { eventAtomFormValues } from 'atom';
import { useEventsData } from 'hooks';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { resetScroll } from 'utils/helper';
import EventForm from '../components/EventForm';
import { eventInitialState } from 'utils/validator/event';
export default function EventCreateEdit() {
  const setInitState = useSetAtom(eventAtomFormValues);
  const { getSingleEventById } = useEventsData();
  const params = useParams();

  const bindingToForm = async () => {
    const eventState = await getSingleEventById(params.id);
    console.log('id is', eventState);
    if (eventState) {
      setInitState(eventState);
    }
  };
  useEffect(() => {
    let timeoutId;
    if (params.id) {
      bindingToForm();
    }
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    resetScroll();
    return () => setInitState(eventInitialState);
  }, []);

  return (
    <Box>
      <EventForm />
    </Box>
  );
}
