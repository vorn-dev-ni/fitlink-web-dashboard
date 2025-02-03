// material-ui
// project import
import { FormOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TableAppBar from 'components/TableAppBar';
import AppPageHeader from 'pages/components/AppPageHeader';
import SubmitTables from './components/SubmitTable';
import { Outlet, useNavigate } from 'react-router';
import { useSubmissions } from 'hooks';
export default function SubmitPage() {
  // const currUser = auth;
  const { palette } = useTheme();
  const navigate = useNavigate();
  const { formEvents, loading } = useSubmissions();

  return (
    <Box>
      <AppPageHeader title={'All Submissions'}>
        <FormOutlined
          style={{
            fontSize: '25px',
            color: palette.primary.light
          }}
        />
      </AppPageHeader>
      <TableAppBar label={'Submission'} handleNavigate={() => navigate('/submissions/create')} />
      <SubmitTables formEvents={formEvents} loading={loading} />
      <Outlet />
    </Box>
  );
}
