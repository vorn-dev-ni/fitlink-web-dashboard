// src/jotaiConfig.js
import { atom } from 'jotai';
import { createJSONStorage, atomWithStorage } from 'jotai/utils';

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

export const globalAtom = atom('Hi vorn');
export const userAtom = atomWithStorage('users', defaultUser, storage);
