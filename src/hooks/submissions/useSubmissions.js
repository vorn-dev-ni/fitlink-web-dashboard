import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from 'utils/config/firebase';
import { collectionNames } from 'utils/helper';
import dayjs from 'dayjs';

export const useSubmissions = () => {
  const [formEvents, setFormSubmit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const formCollections = collection(db, collectionNames.submission);
    const q = query(formCollections, orderBy('submission_date', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const formApprovals = snapshot.docs.map((doc) => {
          const timestamp = doc.data()?.submission_date;
          return {
            id: doc.id,
            email: doc.data()?.email,
            contact_name: doc.data()?.contact_name,
            status: doc.data()?.status || 'pending', // Default to 'pending'
            proof_documents: doc.data()?.proof_documents,
            submission_date: dayjs(new Date(timestamp.seconds * 1000)).format('DD MMM YYYY'),
            submission_timestamp: dayjs(new Date(timestamp.seconds * 1000)).format('h:mm A'),
            address: doc.data()?.address,
            phone_number: doc.data()?.phone_number
          };
        });
        setFormSubmit(formApprovals);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching submissions:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { formEvents, loading, error };
};
