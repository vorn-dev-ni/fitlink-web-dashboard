import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { useState } from 'react';
import { storage } from 'utils/config/firebase';

const useStorage = () => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deleteFile = async (file) => {
    const imageRef = ref(storage, file);
    await deleteObject(imageRef);
    console.log('File has been delete ');
  };
  const uploadFile = async (file, rootDir) => {
    try {
      const pathRef = `${rootDir}/${Date.now()}-${file.name}`;
      const fileRef = ref(storage, pathRef);
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      if (downloadUrl) {
        console.log('File uploaded successfully! URL:', downloadUrl);
        return downloadUrl;
      }

      return '';
    } catch (error) {
      console.error('Error uploading image:', error);

      //   const errorCode = error.code;
      const errorMessage = error.toString();
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    imageError: error,
    uploadFile,
    deleteFile
  };
};
export default useStorage;
