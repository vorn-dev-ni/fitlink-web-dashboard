// material-ui
// project import
import { UserOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AppSnackBar from 'components/SnackBar';
import TableAppBar from 'components/TableAppBar';
import { useAuthAction, useUserData } from 'hooks';
import AppPageHeader from 'pages/components/AppPageHeader';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { resetScroll } from 'utils/helper';
import UserTables from './components/UserTable';

export default function UserPage() {
  const navigation = useNavigate();
  const { palette } = useTheme();
  const { error: userError, handleDeleteUser } = useAuthAction();
  const [showError, setShowError] = useState(false);
  const [mutateState, setMutateState] = useState({ sortBy: 'desc' });
  const { users, loading } = useUserData(mutateState.sortBy);
  const [hightLightText, setHighLightText] = useState('');
  const [localStateUser, setLocalStateUser] = useState([]);
  const handleSort = useCallback(() => {
    setMutateState((pre) => ({ ...pre, sortBy: pre.sortBy == 'desc' ? 'asc' : 'desc' }));
  }, []);

  const onClickDelete = useCallback(async (data) => {
    setShowError(true);
    await handleDeleteUser(data.id, data.avatar);
  }, []);

  const onClickEdit = useCallback((data) => {
    const { id } = data;
    navigation(`${id}/edit`);
  }, []);

  const mutateUserState = useMemo(() => {
    return users.filter((item) => item?.fullName?.toLowerCase()?.includes(hightLightText?.toLowerCase()));
  }, [users, hightLightText]);
  const onChangeText = useCallback(
    (e) => {
      const text = e.target.value;
      setHighLightText(text?.trim());
    },
    [users]
  );
  useEffect(() => {
    setLocalStateUser(mutateUserState);
  }, [mutateUserState]);

  useEffect(() => {
    resetScroll();
  }, []);

  useEffect(() => {
    if (userError) {
      setShowError(true);
    }
  }, [userError]);

  return (
    <Box>
      <AppSnackBar
        title={userError ?? 'Successfully deleted'}
        state={userError ? 'failed' : 'success'}
        open={showError}
        handleClose={() => {
          setShowError(false);
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
      <UserTables users={localStateUser} loading={loading} hightLightText={hightLightText} onDelete={onClickDelete} onEdit={onClickEdit} />
    </Box>
  );
}
