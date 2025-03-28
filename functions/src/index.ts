/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import { Message } from 'firebase-admin/messaging';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v1';
import sharp from 'sharp';
admin.initializeApp();
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const handleInvalidToken = functions.firestore.document('users/{userId}').onUpdate((change, context) => {
  const userId = context.params.userId;
  const newValue = change.after.data();
  const oldValue = change.before.data();

  if (!newValue.fcmToken && oldValue.fcmToken) {
    // Remove the FCM token from your database
    return admin.firestore().collection('users').doc(userId).update({
      fcmToken: admin.firestore.FieldValue.delete()
    });
  }
  return null;
});
export const sendNotificationToSpecificUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('permission-denied', 'User must be authenticated');
  }

  const { eventType, senderID, receiverID, postID, text } = data;

  if (!eventType || !senderID || !receiverID) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
  }

  const userReceiverRef = admin.firestore().collection('users').doc(receiverID);
  const userReceiverSnap = await userReceiverRef.get();
  if (!userReceiverSnap.exists) {
    console.log('Receiver not found');
    return { message: 'Receiver not found' };
  }

  // Retrieve the receiver's FCM token
  const userRef = admin.firestore().collection('users').doc(senderID);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    console.log('User not found');
    return { message: 'User not found' };
  }
  const userDataSender = userSnap.data();
  const senderImageUrl = userDataSender?.imageUrl || null;

  const userReceiverSender = userReceiverSnap.data();
  const fcmTokenReceiver = userReceiverSender?.fcmToken;
  if (!fcmTokenReceiver) {
    console.log('FCM token not found');
    return { message: 'FCM token not found' };
  }

  // Prepare the notification payload
  let title = '';
  let body = '';
  let notificationData = { type: eventType, senderID, receiverID, postID, text };

  switch (eventType) {
    case 'like':
      title = 'New Like on Your Post';
      body = `${userDataSender?.fullName} liked your post.`;
      notificationData.postID = postID;
      break;
    case 'comment':
      title = 'New Comment on Your Post';
      body = `${userDataSender?.fullName} commented on your post.`;
      notificationData.postID = postID;
      break;
    case 'comment-liked':
      title = 'Someone liked on Your Comment';
      body = `${userDataSender?.fullName} has liked your comment on post.`;
      notificationData.postID = postID;
      break;
    case 'following':
      title = 'New Follower';
      body = `${userDataSender?.fullName} started following you.`;
      notificationData.postID = senderID;
      break;
    case 'submission':
      title = 'You have been promoted';
      body = `Congratulation, you can now start posting events !!!`;
      notificationData.postID = senderID;
      //This should be event id so i can deep link in app
      break;
    case 'join-event':
      title = 'Someone has interest in your Event';
      body = `${userDataSender?.fullName} is interested in your event`;
      notificationData.postID = senderID;
      break;
    case 'chat':
      title = `${userDataSender?.fullName}`;
      body = text;
      notificationData.postID = postID;
      break;
    case 'videoLiked':
      title = `${userDataSender?.fullName}`;
      body = `${userDataSender?.fullName} has like your video.`;
      notificationData.postID = postID;
      break;
    case 'videoCommentLiked':
      title = `${userDataSender?.fullName}`;
      body = `${userDataSender?.fullName} has comment on your video.`;
      notificationData.postID = postID;
      break;
    default:
      throw new functions.https.HttpsError('invalid-argument', 'Invalid event type');
  }

  const payload: Message = {
    notification: {
      title: title,
      body: body
    },
    data: notificationData,
    token: fcmTokenReceiver
  };
  if (senderImageUrl) {
    payload.android = {
      notification: {}
    };
  }

  if (senderImageUrl) {
    payload.apns = {
      payload: {
        aps: {
          mutable_content: 1
        }
      }
    };
  }

  try {
    const response = await admin.messaging().send(payload);
    console.log('Successfully sent message:', response);
  } catch (error: any) {
    console.error('Error sending message:', error);

    if (error?.code === 'messaging/registration-token-not-registered') {
      await admin.firestore().collection('users').doc(receiverID).update({
        fcmToken: admin.firestore.FieldValue.delete()
      });
      throw new functions.https.HttpsError('internal', 'FCM token invalid. Removed from Firestore.');
    }

    throw new functions.https.HttpsError('internal', 'Failed to send notification');
  }

  // const notificationRef = admin.firestore().collection('users').doc(receiverID).collection('notifications').doc();
  const notificationRef = admin.firestore().collection('users').doc(receiverID);
  await notificationRef.update({
    notificationReadCount: admin.firestore.FieldValue.increment(1)
  });
  const newNotificationRef = notificationRef.collection('notifications').doc();
  await newNotificationRef.set({
    type: eventType,
    senderID: senderID,
    postID: postID || null,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    read: false
  });

  return { message: 'Notification sent successfully' };
});
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

export const sendNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('permission-denied', 'User must be authenticated');
  }

  const { token, title, body, dataPayload, soundUrl } = data;

  if (!token || !title || !body) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
  }

  // FCM message payload
  const message: admin.messaging.Message = {
    notification: {
      title: title,
      body: body
    },
    android: {
      notification: {
        sound: soundUrl || 'default' // Custom sound file in res/raw/
      }
    },
    apns: {
      payload: {
        aps: {
          sound: soundUrl || 'default' // Custom sound file in the iOS app bundle
        }
      }
    },
    data: dataPayload || {},
    token: token
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return { message: 'Notification sent successfully', response };
  } catch (error: any) {
    console.error('Error sending message:', error);

    if (error?.code === 'messaging/registration-token-not-registered') {
      // Remove the invalid token from Firestore

      throw new functions.https.HttpsError('internal', 'FCM token invalid. Removed from Firestore.');
    }

    throw new functions.https.HttpsError('internal', 'Failed to send notification');
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
        cover_feature: '',
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
