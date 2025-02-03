// src/jotaiConfig.js
import { atom } from 'jotai';
import { createJSONStorage, atomWithStorage } from 'jotai/utils';
import { eventInitialState } from 'utils/validator/event';
import { userInitialValues } from 'utils/validator/user';

export const defaultUser = {
  uid: '',
  fullName: '',
  email: '',
  role: '',
  avatar: '',
  provider: '',
  role: ''
};
const storage = createJSONStorage(
  // getStringStorage
  () => localStorage
);

export const userAtom = atomWithStorage('users', defaultUser, storage);
export const userAtomFormValues = atom(userInitialValues);
export const eventAtomFormValues = atom(eventInitialState);
export const submissionAtomFormValues = atom({});
export const currentUserLocationAtom = atom({ latitude: '', longtitude: '' });
