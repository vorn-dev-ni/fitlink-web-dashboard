import { doc, deleteDoc } from 'firebase/firestore';
import { db } from 'utils/config/firebase';
import { collectionNames } from 'utils/helper';

export const actionDeleteUser = async (id, avatar) => {
  console.log('deleteing with ', id, avatar);
  try {
    await deleteDoc(doc(db, collectionNames.users, id));
    console.log('user successfully deleted !!!');
  } catch (error) {
    throw error;
  }
};
