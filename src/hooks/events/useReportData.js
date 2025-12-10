import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from 'utils/config/firebase';
import { collectionNames } from 'utils/helper';

export const useReportData = (sortBy) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportCollections = collection(db, collectionNames.reports);
  const queryReports = query(reportCollections);

  useEffect(() => {
    // snapshot listener for real-time updates
    const unsubscribe = onSnapshot(
      queryReports,
      (snapshot) => {
        const eventData = snapshot.docs.map((doc) => ({
          id: doc.id,
          postId: doc.data().postId,
          type: doc.data().type,
          reason: doc.data().reason
        }));
        setReports(eventData);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [sortBy]);

  return { reports, loading, error };
};
