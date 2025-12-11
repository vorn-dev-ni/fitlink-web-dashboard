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
        const reports = snapshot.docs.map((doc) => ({
          type: doc.data().type ?? 'N/A',

          postId: doc.data().postId ?? 'N/A',

          reason: doc.data().reason ?? 'N/A'
        }));

        console.log('Report collection is', reports);
        setReports(reports);
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
