import { defaultUser } from 'atom';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { auth, db, functions } from 'utils/config/firebase';
import { collectionNames, delay, getFilePathFromUrl } from 'utils/helper';
import useUsersCollection from './useUserData';
import { useSetAtom } from 'jotai';
import { userAtom } from 'atom';
import { doc, deleteDoc } from 'firebase/firestore';
import useStorage from 'hooks/storage/useStorage';

const useAuthAction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserById } = useUsersCollection();
  const { deleteFile } = useStorage();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const setUser = useSetAtom(userAtom);

  const successUser = async (userId) => {
    const userRole = await getUserById(userId);
    setUser({
      uid: userRole?.uid,
      fullName: userRole?.fullName,
      email: userRole?.email?.trim(),
      role: userRole?.role,
      avatar: userRole?.avatar,
      provider: userRole?.provider,
      role: userRole?.role
    });
    if (userRole?.role === 'admin') {
      setIsAuth(true);
      setLoading(false);

      // const urlRedirect = location.pathname == '/login' ? '/' : location.pathname;
      // console.log('url redirect is', urlRedirect);
      if (location.pathname === '/login') {
        navigate('/dashboard/default', { replace: true });
      } else {
        navigate(location.pathname, { replace: true });
      }

      return;
    }
    setError('Unauthorized User');
    setLoading(false);
    // await auth.signOut();

    location.pathname != '/' && navigate('/login', { replace: true });
  };

  const invalidUser = async () => {
    navigate('/login', { replace: true });
    setIsAuth(false);
    await delay(500);
    setLoading(false);
  };
  const handleDeleteUser = async (id, avatar) => {
    setLoading(true);
    console.log('deleteing with ', id, avatar);
    try {
      await deleteDoc(doc(db, collectionNames.users, id));
      if (avatar) {
        const file = getFilePathFromUrl(avatar);
        await deleteFile(file);
        console.log('successfully delete file !!!');
      }

      console.log('user successfully deleted !!!');
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateCreate = async (id, params) => {
    setLoading(true);
    try {
      console.log('params is ', params);
      const createUser = httpsCallable(functions, 'createEditUser');
      delete params.firstName;
      delete params.lastName;

      const result = await createUser({
        ...params,
        photoURL: params?.avatar ?? '',
        type: id ? 'edit' : 'create',
        uid: id
      });

      console.log('user successfully created !!!', result.data);
    } catch (error) {
      if (params?.avatar) {
        const file = getFilePathFromUrl(params?.avatar);
        await deleteFile(file);
      }
      const errorMessage = error.message;
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    try {
      console.log('logging user out');
      setLoading(true);
      setError(null);
      await auth.signOut();
      setUser(defaultUser);
      //   await  auth.currentUser.reload();
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (userCredential.user?.uid) {
        await successUser(userCredential.user?.uid);
        await auth.currentUser.reload();
        // await getUserById(userCredential.user?.uid);
        return true;
      }
      return false;
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No user found with this email address.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Invalid Email or Password.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many attempt, Please try again later.';
            break;
          default:
            errorMessage = error.message;
        }
      }

      setError(errorMessage);
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(true);
        successUser(user?.uid);
      } else {
        invalidUser();
      }
    });
    return () => unsubscribe();
  }, []);
  return {
    isLoading,
    error,
    handleLogin,
    handleLogout,
    auth,
    isAuth,
    handleDeleteUser,
    handleUpdateCreate
  };
};

export default useAuthAction;
