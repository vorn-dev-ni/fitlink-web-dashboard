// material-ui
// project import
import { UserOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AppSnackBar from 'components/SnackBar';
import TableAppBar from 'components/TableAppBar';
import { useAuthAction, useUserData } from 'hooks';
import AppPageHeader from 'pages/component-overview/AppPageHeader';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { resetScroll } from 'utils/helper';
import UserTables from './UserTable';

export default function UserPage() {
  const navigation = useNavigate();
  const { palette } = useTheme();
  const { error, handleDeleteUser } = useAuthAction();
  const [open, setOpen] = useState(false);
  const [mutateState, setMutateState] = useState({ sortBy: 'desc' });
  const { users, loading } = useUserData(mutateState.sortBy);
  const [hightLightText, setHighLightText] = useState('');
  const [localStateUser, setLocalStateUser] = useState([]);
  const handleSort = useCallback(() => {
    setMutateState((pre) => ({ ...pre, sortBy: pre.sortBy == 'desc' ? 'asc' : 'desc' }));
  }, []);

  const onChangeText = useCallback(
    (e) => {
      const text = e.target.value;
      setHighLightText(text);
      const result = users.slice().filter((user) => user.fullName?.toLowerCase().includes(text.toLowerCase().trim()));
      setLocalStateUser(result);
    },
    [users]
  );
  const onDeleteUser = useCallback(async (data) => {
    await handleDeleteUser(data.id, data.avatar);
    setOpen(true);
  }, []);
  useEffect(() => {
    resetScroll();
  }, []);
  useEffect(() => {
    if (users) {
      setLocalStateUser(users);
    }
  }, [users]);

  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  return (
    <Box>
      <AppSnackBar
        title={error ?? 'Successfully deleted'}
        state={error ? 'failed' : 'success'}
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
      />
      <AppPageHeader title={'All Users'}>
        <UserOutlined
          style={{
            fontSize: '25px',
            color: palette.primary.light
          }}
        />
      </AppPageHeader>
      <TableAppBar handleChangeText={onChangeText} onClickSort={handleSort} label={'Users'} handleNavigate={() => navigation('create')} />
      <UserTables
        users={localStateUser}
        loading={loading}
        hightLightText={hightLightText}
        onDelete={onDeleteUser}
        onEdit={(data) => {
          const { id } = data;
          navigation(`${id}/edit`);
        }}
      />
    </Box>
  );
}
