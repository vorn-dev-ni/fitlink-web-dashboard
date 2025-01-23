// material-ui
// project import
import { FormOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TableAppBar from 'components/TableAppBar';
import AppPageHeader from 'pages/component-overview/AppPageHeader';
import SubmitTables from './SubmitTable';
import { Outlet, useNavigate } from 'react-router';
export default function SubmitPage() {
  // const currUser = auth;
  const { palette } = useTheme();
  const navigate = useNavigate();
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
      <SubmitTables />
      <Outlet />
    </Box>
  );
}
