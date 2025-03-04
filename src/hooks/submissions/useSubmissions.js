import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from 'utils/config/firebase';
import { collectionNames } from 'utils/helper';
import dayjs from 'dayjs';

export const useSubmissions = () => {
  const [formEvents, setFormSubmit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const formCollections = collection(db, collectionNames.submission);
    const unsubscribe = onSnapshot(
      formCollections,
      (snapshot) => {
        const formApprovals = snapshot.docs.map((doc) => {
          const timestamp = doc.data()?.submission_date;
          let submissionDate;

          if (timestamp?.toDate) {
            submissionDate = timestamp.toDate();
          } else if (timestamp instanceof Date) {
            submissionDate = timestamp;
          } else if (typeof timestamp === 'string') {
            submissionDate = dayjs(timestamp).toDate();
          } else {
            submissionDate = new Date();
          }

          return {
            id: doc.id,
            email: doc.data()?.email,
            contact_name: doc.data()?.contact_name,
            status: doc.data()?.status || 'pending',
            proof_documents: doc.data()?.proof_documents,
            submission_date: submissionDate,
            submission_timestamp: dayjs(submissionDate).format('h:mm A')
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
