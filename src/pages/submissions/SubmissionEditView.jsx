// material-ui
// project import
import { FormOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TableAppBar from 'components/TableAppBar';
import AppPageHeader from 'pages/component-overview/AppPageHeader';
import SubmitTables from './SubmitTable';
export default function SubmissionEditView() {
  // const currUser = auth;
  const { palette } = useTheme();
  return (
    <Box>
      <AppPageHeader title={'Create Submissions'}>
        <FormOutlined
          style={{
            fontSize: '25px',
            color: palette.primary.light
          }}
        />
      </AppPageHeader>
      <TableAppBar label={'Submission'} />
      <SubmitTables />
    </Box>
  );
}
