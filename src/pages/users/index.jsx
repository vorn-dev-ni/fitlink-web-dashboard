// material-ui
// project import
import { UserOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AppSnackBar from 'components/SnackBar';
import TableAppBar from 'components/TableAppBar';
import { useStorage, useUserData } from 'hooks';
import AppPageHeader from 'pages/components/AppPageHeader';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { getFilePathFromUrl, resetScroll } from 'utils/helper';
import { actionDeleteUser } from './action';
import UserTables from './components/UserTable';

export default function UserPage() {
  const navigation = useNavigate();
  const { palette } = useTheme();
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { deleteFile } = useStorage();

  const [mutateState, setMutateState] = useState({ sortBy: 'desc' });
  const { users, loading } = useUserData(mutateState.sortBy);
  const [hightLightText, setHighLightText] = useState('');
  const [localStateUser, setLocalStateUser] = useState([]);
  const handleSort = useCallback(() => {
    setMutateState((pre) => ({ ...pre, sortBy: pre.sortBy == 'desc' ? 'asc' : 'desc' }));
  }, []);

  const onClickDelete = useCallback(async (data) => {
    setShowError(true);
    try {
      await actionDeleteUser(data.id, data.avatar);
      if (avatar) {
        const file = getFilePathFromUrl(avatar);
        await deleteFile(file);
        console.log('successfully delete file !!!');
      }

      console.log('user successfully deleted !!!');
    } catch (error) {
      const errorMessage = error.message;
      setShowError(true);
      setErrorMsg(errorMessage);
      throw error;
    } finally {
    }
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
    console.log('User page mounted');
    return () => {
      console.log('User page unmounted');
    };
  }, []);
  return (
    <Box>
      <AppSnackBar
        title={errorMsg ?? 'Successfully deleted'}
        state={errorMsg ? 'failed' : 'success'}
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
