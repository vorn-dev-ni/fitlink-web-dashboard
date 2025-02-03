import dayjs from 'dayjs';
import * as Yup from 'yup';

export const eventValidationSchema = Yup.object().shape({
  address: Yup.string().required('Address is required'),
  descriptions: Yup.string()
    .min(6, 'Minimum description is 6 characters')
    .max(500, 'Maximum description is 500 characters')
    .required('Description is required'),
  startDate: Yup.string().required('Start date and End Date are required'),
  endDate: Yup.string().required('Start date and End Date are is required'),
  establishment: Yup.string().required('Establishment is required'),
  eventTitle: Yup.string()
    .min(3, 'Minimum title is 3 characters')
    .max(100, 'Maximum title is 100 characters')
    .required('Event title is required'),
  feature: Yup.string().required(' Poster image is required'),
  lat: Yup.number().nullable().required('Latitude is required'),
  lng: Yup.number().nullable().required('Longitude is required'),
  price: Yup.string()
    .nullable()
    .matches(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number'),

  timeStart: Yup.string().required('Start time is required'),
  timeEnd: Yup.string().required('End time is required')
});

export const eventInitialState = {
  address: '',
  descriptions: '',
  startDate: '',
  endDate: '',
  establishment: '',
  eventTitle: '',
  feature: '',
  lat: null,
  lng: null,
  price: '',
  timeEnd: dayjs(),
  timeStart: dayjs()
};
