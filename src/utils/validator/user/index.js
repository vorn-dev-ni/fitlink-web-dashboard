import * as Yup from 'yup';
export const phoneRegex = /^(?:\+?\d{1,3}[-\s]?)?(?:\(?\d{1,4}\)?[-\s]?)?\d{1,4}[-\s]?\d{1,4}[-\s]?\d{1,4}$/;

export const isEmail = (value) => {
  return value.includes('@');
};

export const userValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email')
    .max(100, 'Email is too long')
    .test('email-or-phone', 'Email is required if no phone', function (value) {
      const { phone } = this.parent; // Access other fields in the parent
      if (!phone && !value) {
        return false; // Either email or phone is required
      }
      return true;
    }),

  phone: Yup.string()
    .nullable()
    .matches(phoneRegex, 'Please enter a valid phone number')
    .test('phone-or-email', 'Phone is required if no email', function (value) {
      const { email } = this.parent; // Access other fields in the parent
      if (!email && !value) {
        return false; // Either phone or email is required
      }
      return true;
    }),
  password: Yup.string().min(6, 'Password is too short').max(12, 'Maximum password is 12 characters').required('Password is required'),
  firstName: Yup.string().min(3).max(50).required('First name is required'),
  lastName: Yup.string().min(3).max(50).required('Last name is required'),
  role: Yup.string().required('User role is required'),
  //   phone: Yup.string().matches(phoneRegex, 'Please enter a valid phone number'),
  bio: Yup.string().min(6, 'Minimum bio is 6 characters').max(100, 'Maximum bio is 100 characters').nullable()
});
export const userInitialValues = {
  email: '',
  password: '',
  avatar: '',
  firstName: '',
  lastName: '',
  bio: '',
  role: '',
  phone: ''
};
