/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v1';
import sharp from 'sharp';
admin.initializeApp();
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const compressImage = functions.storage.object().onFinalize(async (object) => {
  const bucket = admin.storage().bucket(object.bucket);
  const filePath = object.name;
  const fileName = filePath?.split('/').pop();
  // Only process images (e.g., jpg, png, jpeg)
  if (!fileName?.match(/\.(jpg|jpeg|png)$/)) {
    console.log('Not an image file, skipping resizing.');
    return;
  }

  const tempFilePath = `/tmp/${fileName}`; // Temporary file path for compressing
  const tempResizedPath = `/tmp/resized-${fileName}`;
  if (filePath) {
    await bucket.file(filePath!).download({ destination: tempFilePath });
    await sharp(tempFilePath).jp2({ quality: 80 }).toFile(tempResizedPath); // Save resized image to temp location
    const compressFilePath = `resized_images/${fileName}`;
    await bucket.upload(tempResizedPath, {
      destination: compressFilePath,
      metadata: { contentType: 'image/jpeg' }
    });
    await bucket.file(filePath).delete();

    // Generate a new download URL for the compressed image
    const file = bucket.file(compressFilePath);
    const [downloadUrl] = await file.getSignedUrl({
      action: 'read', // 'read' for download URL
      expires: Date.now() + 50 * 365 * 24 * 60 * 60 * 1000 // 50 years from now
    });
    console.log(`Compressed image uploaded to ${compressFilePath}`);
    console.log(`Download URL: ${downloadUrl}`);
    return null;
  }

  // Resize the image using Sharp

  return null;
});

export const deleteUserOnFirestoreDelete = functions.firestore
  .document('users/{userId}') // Listen for deletions on the 'users' collection
  .onDelete(async (snap, context) => {
    // Get the user ID (uid) from the document that was deleted
    const userId = context.params.userId;
    try {
      await admin.auth().deleteUser(userId);
      console.log(`Successfully deleted user with UID: ${userId}`);
      return null;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new functions.https.HttpsError('internal', 'Failed to delete user from Firebase Auth');
    }
  });

export const createEditUser = functions.https.onCall(async (data, context) => {
  const { email, password, fullName, photoURL, role = 'admin', bio, uid } = data;
  const type = data?.type as 'edit' | 'create';
  if (!context.auth) {
    throw new functions.https.HttpsError('permission-denied', 'Must be an admin to create users');
  }
  try {
    if (type == 'create') {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: fullName,
        emailVerified: true
      });

      await admin.firestore().collection('users').doc(userRecord.uid).set({
        email,
        fullName: fullName,
        avatar: photoURL,
        provider: 'web-admin',
        bio: bio,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        role
      });
      return { message: `User created with UID:}` };
    } else {
      const authParams = {
        email,
        displayName: fullName,
        password: password,
        emailVerified: true
      };
      if (!email) {
        delete authParams.email;
      }
      if (password === '******') {
        delete authParams.password;
      }
      const userRecord = await admin.auth().updateUser(uid, authParams);
      console.log(`Successfully updated user: ${userRecord}`);
      const firestoreParams = {
        fullName: fullName,
        avatar: photoURL,
        provider: 'web-admin',
        bio: bio,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        role,
        email
      };

      if (!email) {
        delete firestoreParams.email;
      }
      await admin.firestore().collection('users').doc(userRecord.uid).update(firestoreParams);
      return { message: `User updated with UID: ${userRecord.uid}` };
    }
    // Create user without email verification
  } catch (error: any) {
    console.error('Error creating user:', error);

    // Provide a detailed error message depending on the error type
    if (error?.code === 'auth/email-already-exists') {
      throw new functions.https.HttpsError('already-exists', 'The email address is already in use by another account.');
    } else if (error?.code === 'auth/invalid-email') {
      throw new functions.https.HttpsError('invalid-argument', 'The provided email address is not valid.');
    } else if (error?.code === 'auth/weak-password') {
      throw new functions.https.HttpsError('invalid-argument', 'The provided password is too weak.');
    } else {
      // Catch any other unexpected errors
      throw new functions.https.HttpsError('internal', `${error?.message} ${error?.code}`);
    }
  }
});
