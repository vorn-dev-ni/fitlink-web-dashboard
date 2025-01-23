// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import config from "./config";
const firebaseConfig = {
  apiKey: config.AppEnv.APP_API_KEY_DEV,
  authDomain: config.AppEnv.AUTH_DOMAIN_DEV,
  projectId:config.AppEnv.PROJECT_ID_DEV,
  storageBucket:config.AppEnv.STORAGE_BUCKET_DEV,
  messagingSenderId:config.AppEnv.MESSAGING_SENDER_ID_DEV,
  appId: config.AppEnv.APP_ID_DEV,
  measurementId: config.AppEnv.APP_MEASUREMENT_ID
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const analytics = getAnalytics(app);
console.log("Firebase initialized:", app.name);

export default app;
