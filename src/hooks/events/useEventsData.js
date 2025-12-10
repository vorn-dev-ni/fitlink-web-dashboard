import { useState, useEffect } from 'react';
import { collection, doc, getDoc, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from 'utils/config/firebase';
import { collectionNames, formatNumberToPrice } from 'utils/helper';
import dayjs from 'dayjs';

export const useEventsData = (sortBy) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const eventsCollections = collection(db, collectionNames.event);
  const queryEvents = query(eventsCollections, orderBy('preStartDate', sortBy));

  const getSingleEventById = async (docId) => {
    try {
      const docRef = doc(db, collectionNames.event, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.data() != null) {
        return {
          uid: docSnap.id,
          ...docSnap.data(),
          startDate: dayjs(docSnap.data().preStartDate.toDate()),
          endDate: dayjs(docSnap.data().preEndDate.toDate()),
          timeEnd: dayjs(docSnap.data().timeEnd.toDate()),
          timeStart: dayjs(docSnap.data().timeStart.toDate())
        };
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
  useEffect(() => {
    // snapshot listener for real-time updates
    const unsubscribe = onSnapshot(
      queryEvents,
      (snapshot) => {
        const eventData = snapshot.docs.map((doc) => ({
          id: doc.id,
          eventTitle: doc.data().eventTitle,
          feature: doc.data().feature,
          establishment: doc.data().establishment,
          freeEntry: doc.data().freeEntry ? 'Free' : 'Cost',
          price: formatNumberToPrice('en-IN', 'USD', doc.data().price),
          startDate: doc.data().startDate,
          endDate: doc.data().endDate
        }));
        console.log('event is', events);
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
  }, [sortBy]);

  return { events, loading, error, getSingleEventById };
};
