import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from 'utils/config/firebase';
import { collectionNames, formatDateApp } from 'utils/helper';

export const useSubmissions = () => {
  const [formEvents, setFormSubmit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const formCollections = collection(db, collectionNames.submission);
    // snapshot listener for real-time updates
    const unsubscribe = onSnapshot(
      formCollections,
      (snapshot) => {
        const formApprovals = snapshot.docs.map((doc) => {
          const timestamp = doc.data()?.submission_date;
          return {
            id: doc.id,
            email: doc.data()?.email,
            contact_name: doc.data()?.contact_name,
            status: doc.data()?.status,
            proof_documents: doc.data()?.proof_documents,
            submission_date: formatDateApp(new Date(timestamp.seconds * 1000))
          };
        });
        setFormSubmit(formApprovals);
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

  return { formEvents, loading, error };
};
