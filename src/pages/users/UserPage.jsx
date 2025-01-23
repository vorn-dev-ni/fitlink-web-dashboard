// material-ui
// project import
import { UserOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TableAppBar from 'components/TableAppBar';
import AppPageHeader from 'pages/component-overview/AppPageHeader';
import UserTables from './UserTable';

export default function UserPage() {
  // const currUser = auth;
  const { palette } = useTheme();
  return (
    <Box>
      <AppPageHeader title={'All Users'}>
        <UserOutlined
          style={{
            fontSize: '25px',
            color: palette.primary.light
          }}
        />
      </AppPageHeader>
      <TableAppBar label={'Users'} />
      <UserTables />
    </Box>
  );
}
