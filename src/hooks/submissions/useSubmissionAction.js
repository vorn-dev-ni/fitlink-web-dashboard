import { addDoc, deleteDoc } from 'firebase/firestore';
import { useState } from 'react';
import { db } from 'utils/config/firebase';
import { collectionNames } from 'utils/helper';

export const useSubmissionActions = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const createSubmission = async (params) => {
    try {
      setLoading(true);
      setError(null);
      const docRef = await addDoc(collection(db, collectionNames.submission), { ...params });
      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const DeleteSubmission = async ({ docId }) => {
    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, collectionNames.submission, docId);
      console.log('Document with ID: ', docRef.id, 'has been deleted');

      // Delete the document
      await deleteDoc(docRef);
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return { createSubmission, loading, error, DeleteSubmission };
};
