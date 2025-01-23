import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from 'utils/config/firebase';

export const useEventsData = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const eventsCollections = collection(db, 'events');
    // snapshot listener for real-time updates
    const unsubscribe = onSnapshot(
      eventsCollections,
      (snapshot) => {
        const eventData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventData);
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

  return { events, loading, error };
};
