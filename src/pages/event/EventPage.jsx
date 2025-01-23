// material-ui

// project import
// project import
import { DatabaseOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TableAppBar from 'components/TableAppBar';
import AppPageHeader from 'pages/component-overview/AppPageHeader';
import EventTable from './EventTable';

export default function EventPage() {
  const { palette } = useTheme();
  return (
    <Box component={'h1'}>
      <AppPageHeader title={'All Events'}>
        <DatabaseOutlined
          style={{
            fontSize: '25px',
            color: palette.primary.light
          }}
        />
      </AppPageHeader>
      <TableAppBar label={'Events'} />
      <EventTable />
    </Box>
  );
}
