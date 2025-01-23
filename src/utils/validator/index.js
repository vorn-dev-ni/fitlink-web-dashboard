import * as Yup from 'yup';

export const loginInitalValues = {
  email: '',
  password: '',
  submit: null
};
export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  password: Yup.string().max(255).required('Password is required')
});
