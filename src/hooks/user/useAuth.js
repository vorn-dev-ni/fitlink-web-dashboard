import { defaultUser, userAtom } from 'atom';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { auth, db } from 'utils/config/firebase';
import { AppException, FirebaseException } from 'utils/exception';
import { collectionNames, delay } from 'utils/helper';

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const setUser = useSetAtom(userAtom);
  const successUser = async (userId) => {
    const userRole = (await getUserById(userId)) ?? '';
    if (userRole === 'admin') {
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
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('User is authenticated ', user?.uid);
      if (user) {
        setLoading(true);
        successUser(user?.uid);
      } else {
        invalidUser();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      console.log('logging user out');
      setLoading(true);
      setError(null);
      await auth.signOut();
      setUser(defaultUser);
      //   await  auth.currentUser.reload();
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorMessage);
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
        console.log('User logged in successfully:', userCredential.user);
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

      console.log(errorMessage);

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const getUserById = async (userId) => {
    try {
      const docRef = doc(db, collectionNames.users, userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log('current user is ', docSnap.data());
        const result = docSnap.data();
        setUser({
          uid: result?.uid,
          fullName: result?.fullName,
          email: result?.email,
          role: result?.role,
          avatar: result?.avatar,
          provider: result?.provider,
          role: result?.role
        });
        return docSnap.data()?.role;
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error(error);
      if (error.code) {
        throw new FirebaseException(error.message, error.code);
      }
      throw new AppException(error);
    }
  };

  return {
    isLoading,
    error,
    handleLogin,
    handleLogout,
    auth,
    isAuth,
    getUserById
  };
};
