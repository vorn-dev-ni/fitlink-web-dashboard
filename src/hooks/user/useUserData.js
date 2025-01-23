import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from 'utils/config/firebase';

const useUsersCollection = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const usersCollection = collection(db, 'users');
    // snapshot listener for real-time updates
    const unsubscribe = onSnapshot(
      usersCollection,
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
  }, []);

  return { users, loading, error };
};

export default useUsersCollection;
