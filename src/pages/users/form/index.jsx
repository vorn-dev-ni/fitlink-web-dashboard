// material-ui
// project import
import { Box } from '@mui/material';
import { userAtomFormValues } from 'atom';
import { useUserData } from 'hooks';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { resetScroll } from 'utils/helper';
import { isEmail, userInitialValues } from 'utils/validator/user';
import UserForm from '../components/UserForm';
export default function UserCreateEdit() {
  const setInitState = useSetAtom(userAtomFormValues);
  const { getUserById } = useUserData();
  const params = useParams();

  const bindingToForm = async () => {
    const userForm = await getUserById(params.id);
    if (userForm) {
      const emailExist = isEmail(userForm?.email);

      setInitState({
        avatar: userForm.avatar,
        bio: userForm.bio,
        email: emailExist ? userForm.email : '',
        firstName: userForm.fullName.split(' ')[0],
        lastName: userForm.fullName.split(' ')[1],
        role: userForm.role,
        phone: !emailExist ? userForm.email : '',
        password: userForm.password ?? '******' //Fake passwords
      });
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
    return () => setInitState(userInitialValues);
  }, []);

  return (
    <Box>
      <UserForm />
    </Box>
  );
}
