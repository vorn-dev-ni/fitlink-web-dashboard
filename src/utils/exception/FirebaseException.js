import AppException from './AppException';
class FirebaseException extends AppException {
  constructor(message, code = 'FIREBASE_ERROR') {
    switch (code) {
      case 'auth/invalid-email':
        message = 'The email address is not valid';
        break;
      case 'auth/user-not-found':
        message = 'No user found with this email';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please try again later';
        break;
      default:
        message = error.message;
        break;
    }
    super(message, code);
  }
}

export default FirebaseException;
