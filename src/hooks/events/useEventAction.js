import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useStorage } from 'hooks/index';
import { useState } from 'react';
import { db } from 'utils/config/firebase';
import { collectionNames, formatToDate, getFilePathFromUrl } from 'utils/helper';

const useEventAction = () => {
  const collections = collection(db, collectionNames.event);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { deleteFile } = useStorage();
  const handleCreateEvent = async (params) => {
    setLoading(true);
    try {
      const docRef = await addDoc(collections, {
        ...params,
        freeEntry: params?.price ? false : true,
        startDate: formatToDate(params.startDate, 'MMM D, YYYY'),
        endDate: formatToDate(params.endDate, 'MMM D, YYYY'),
        createdAt: serverTimestamp(),
        participants: []
      });

      console.log('Event successfully created!', docRef);
    } catch (error) {
      if (params?.feature) {
        const file = getFilePathFromUrl(params?.feature);
        await deleteFile(file);
      }
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateEvent = async (params, docId) => {
    setLoading(true);
    try {
      console.log('updating event xxx ', params);

      const docRef = doc(db, collectionNames.event, docId);

      await updateDoc(docRef, {
        ...params,
        freeEntry: params?.price ? false : true,
        startDate: formatToDate(params.startDate, 'MMM D, YYYY'),
        endDate: formatToDate(params.endDate, 'MMM D, YYYY'),
        updatedAt: serverTimestamp()
      });

      console.log('Event successfully updated!!!');
    } catch (error) {
      if (params?.avatar) {
        const file = getFilePathFromUrl(params?.avatar);
        await deleteFile(file);
      }
      const errorMessage = error.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteEvent = async (id, feature) => {
    setLoading(true);
    console.log('deleteing event with ', id, feature);
    try {
      await deleteDoc(doc(db, collectionNames.event, id));
      if (feature) {
        const file = getFilePathFromUrl(feature);
        await deleteFile(file);
        console.log('successfully delete file !!!');
      }

      console.log('event successfully deleted !!!');
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    error,
    loading: isLoading,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent
  };
};

export default useEventAction;
