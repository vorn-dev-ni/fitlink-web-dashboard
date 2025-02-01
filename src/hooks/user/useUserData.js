import { collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from 'utils/config/firebase';
import { collectionNames } from 'utils/helper';

const useUserData = (sortBy) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const usersCollection = collection(db, collectionNames.users);
  const usersQuery = query(usersCollection, orderBy('createdAt', sortBy));
  useEffect(() => {
    const unsubscribe = onSnapshot(
      usersQuery,
      (snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data()?.email,
          fullName: doc.data()?.fullName,
          provider: doc.data()?.provider,
          role: doc.data()?.role
        }));
        setUsers(usersData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching users:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [sortBy]);

  const getUserById = async (userId) => {
    try {
      const docRef = doc(db, collectionNames.users, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.data() != null) {
        return docSnap.data();
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

  return { users, loading, error, getUserById };
};

export default useUserData;
