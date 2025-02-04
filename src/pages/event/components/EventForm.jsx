import { ArrowLeftOutlined, DollarOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Box, Button, Container, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TimePicker } from '@mui/x-date-pickers';
import { eventAtomFormValues, userAtom } from 'atom';
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import AppSnackBar from 'components/SnackBar';
import { Field, Formik } from 'formik';
import { useEventAction, useStorage } from 'hooks';
import { useAtomValue } from 'jotai';
import MapPicker from 'pages/components/MapPicker';
import { memo, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import DatePicker from 'react-multi-date-picker';
import { useNavigate, useParams } from 'react-router';
import { eventValidationSchema } from 'utils/validator/event';

const defaultMutateState = {
  title: '',
  type: 'success',
  showSnackBar: false
};
const abortcontroller = new AbortController();
const EventForm = () => {
  const eventInitialState = useAtomValue(eventAtomFormValues);
  const { error: eventError, handleCreateEvent, handleUpdateEvent, loading } = useEventAction();
  const { palette } = useTheme();
  const params = useParams();
  const [mapKey, setMapKey] = useState(0);
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState({
    file: null,
    image: ''
  });

  const currentUser = useAtomValue(userAtom);
  const [mutateState, setMutateState] = useState(defaultMutateState);
  const { uploadFile, imageError, deleteFile } = useStorage();
  const handleSubmitEvents = async (values, actions) => {
    let downloadUrl = '';
    const args = {
      ...values,
      preStartDate: new Date(values.startDate),
      preEndDate: new Date(values.endDate),
      timeEnd: new Date(values.timeEnd),
      timeStart: new Date(values.timeStart),
      feature: downloadUrl || previewImage.image,
      authorFeature: currentUser.avatar,
      authorEmail: currentUser.email,
      authorId: currentUser.uid,
      authorName: currentUser.fullName
    };

    if (previewImage.file != null) {
      downloadUrl = await uploadFile(previewImage.file, 'images');
    }
    if (!params.id) {
      //Only reset if user is creating only
      await handleCreateEvent(args);
      actions.resetForm();
      setMapKey((pre) => pre + 1);
      setPreviewImage({
        file: null,
        image: ''
      });
    } else {
      console.log('updating event');
      await handleUpdateEvent(args, params.id);
      console.log('success event');

      if (previewImage.file != null) {
        if (eventInitialState.feature) {
          const file = getFilePathFromUrl(eventInitialState?.feature);
          await deleteFile(file);
        }
      }
    }
    setMutateState({
      showSnackBar: true,
      type: 'success',
      title: 'Saved changes has been completed!!!'
    });
  };
  useEffect(() => {
    setPreviewImage((pre) => ({ ...pre, image: eventInitialState.feature }));
  }, [eventInitialState]);
  useEffect(() => {
    if (imageError || eventError) {
      setMutateState({
        showSnackBar: true,
        type: 'failed',
        title: imageError || eventError
      });
    }
  }, [eventError, imageError]);

  return (
    <Formik enableReinitialize initialValues={eventInitialState} validationSchema={eventValidationSchema} onSubmit={handleSubmitEvents}>
      {({ handleSubmit, isSubmitting, values, setFieldValue }) => {
        const onDrop = (acceptedFiles) => {
          if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const imageUrl = URL.createObjectURL(file);
            setFieldValue('feature', imageUrl);
            setPreviewImage({ file, image: imageUrl });
          }
        };
        const updateAddress = async (fulAddress, lat, lng) => {
          if (fulAddress) {
            setFieldValue('address', fulAddress);
            setFieldValue('lat', lat);
            setFieldValue('lng', lng);
          }
        };

        const { getRootProps, getInputProps } = useDropzone({
          onDrop,
          accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp']
          },
          multiple: false
        });

        return (
          <form onSubmit={handleSubmit}>
            <AppSnackBar
              duration={4000}
              state={mutateState.type}
              title={mutateState.title}
              open={mutateState.showSnackBar}
              handleClose={() => {
                setMutateState((pre) => ({ ...pre, showSnackBar: false }));
              }}
            />

            <Stack spacing={4}>
              {/* <Typography>{JSON.stringify(values?.startDate)}</Typography>
              <Typography>{JSON.stringify(new Date(values.endDate))}</Typography> */}
              <Stack
                direction={'row'}
                justifyContent={'space-between'}
                sx={{
                  marginBottom: 4
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => navigate(-1)}
                  startIcon={<ArrowLeftOutlined />}
                  sx={{
                    backgroundColor: palette.primary.light
                  }}
                >
                  Back
                </Button>

                <Button type="submit" variant="outlined" disabled={isSubmitting} startIcon={<SaveOutlined />} sx={{}}>
                  {isSubmitting ? 'Saving Record...' : 'Save'}
                </Button>
              </Stack>
              <MainCard>
                <Grid container spacing={4} py={2} direction={'row-reverse'}>
                  <Grid item xs={12} md={6} lg={9}>
                    <Stack spacing={1}>
                      <Field name="feature">
                        {({
                          field,
                          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                          meta
                        }) => (
                          <Box
                            sx={{
                              width: '100%'
                            }}
                          >
                            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                              <Typography variant="h5">Upload Event Poster</Typography>
                              {meta.touched && meta.error && <Typography color={'red'}>{meta.error} *</Typography>}
                            </Stack>

                            <div
                              {...getRootProps()}
                              style={{
                                padding: '16px',
                                border: '2px dashed rgba(195, 216, 250, 0.88)',
                                borderRadius: '12px',
                                backgroundColor: 'rgb(241, 246, 254)',
                                paddingTop: 40
                              }}
                            >
                              <input {...getInputProps()} />

                              <Container
                                sx={{
                                  padding: 2,
                                  textAlign: 'center',
                                  width: '100%',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  minHeight: '200px'
                                }}
                              >
                                <Stack alignItems={'center'} spacing={2}>
                                  <UploadOutlined style={{ fontSize: '50px', color: palette.primary.dark }} />
                                  <Typography variant="h5" color={palette.primary.dark}>
                                    Drag or Upload File
                                  </Typography>
                                </Stack>
                              </Container>
                            </div>
                          </Box>
                        )}
                      </Field>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <Stack spacing={1}>
                      <Box
                        sx={{
                          width: '100%'
                        }}
                      >
                        <Stack direction={'row'} spacing={0} alignItems={'center'}>
                          <Typography pb={1} variant="h5">
                            Preview Image
                          </Typography>
                        </Stack>

                        <div
                          style={{
                            padding: '16px',
                            border: '2px dashed rgba(195, 216, 250, 0.88)',
                            borderRadius: '12px'
                            // backgroundColor: 'rgb(241, 246, 254)'
                          }}
                        >
                          <Container
                            sx={{
                              padding: 2,
                              textAlign: 'center',
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              minHeight: '200px'
                            }}
                          >
                            <Stack alignItems={'center'} spacing={2}>
                              <Box
                                sx={{
                                  borderWidth: 2,
                                  borderColor: 'red'
                                }}
                              >
                                <Avatar sx={{ width: '12rem', height: '12rem' }} alt="preview-images" src={previewImage.image} />
                              </Box>
                            </Stack>
                          </Container>
                        </div>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </MainCard>
              <MainCard>
                <Grid container spacing={2} py={1}>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <Typography variant="h5" py={1}>
                        Event Title
                      </Typography>
                      <Field name="eventTitle">
                        {({
                          field,
                          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                          meta
                        }) => (
                          <Box>
                            <TextField label="Enter Event title" fullWidth {...field} />

                            {meta.touched && meta.error && <Typography color={'red'}>{meta.error} *</Typography>}
                          </Box>
                        )}
                      </Field>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <Typography py={1} variant="h5">
                        Establishment Name
                      </Typography>
                      <Field name="establishment">
                        {({
                          field,
                          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                          meta
                        }) => (
                          <Box>
                            <TextField label="Enter Establishment" fullWidth {...field} />
                            {meta.touched && meta.error && <Typography color={'red'}>{meta.error} *</Typography>}
                          </Box>
                        )}
                      </Field>
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <Typography variant="h5" py={1}>
                        Event Description
                      </Typography>
                      <Field name="descriptions">
                        {({
                          field,
                          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                          meta
                        }) => (
                          <Box>
                            <TextField
                              label="Enter event description ..etc"
                              fullWidth
                              multiline
                              rows={5}
                              {...field}
                              // id="fullWidth"
                            />{' '}
                            {meta.touched && meta.error && <Typography color={'red'}>{meta.error} *</Typography>}
                          </Box>
                        )}
                      </Field>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={12} lg={3}>
                    <Stack spacing={1}>
                      <Typography py={1} variant="h5">
                        Price
                      </Typography>
                      <Field name="price">
                        {({
                          field,
                          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                          meta
                        }) => (
                          <Box>
                            <TextField
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <DollarOutlined />
                                  </InputAdornment>
                                )
                              }}
                              label="Enter price"
                              fullWidth
                              {...field}
                            />
                            {meta.touched && meta.error && <Typography color={'red'}>{meta.error} *</Typography>}
                          </Box>
                        )}
                      </Field>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={12} lg={8} sx={{ width: '100%' }}>
                    <Stack spacing={1}>
                      <Typography variant="h5" py={1}>
                        Date Selection
                      </Typography>
                      <Field name="startDate">
                        {({
                          field,
                          form: { touched, errors }, // form state and meta
                          meta
                        }) => (
                          <Box>
                            <DatePicker
                              placeholder="Select Date"
                              style={{
                                padding: '10px',
                                width: '57.5vw',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                fontSize: '16px'
                              }}
                              {...field}
                              value={[new Date(values.startDate), new Date(values.endDate)]}
                              range
                              inputClass="custom"
                              onChange={(date) => {
                                if (date && date.length === 2) {
                                  setFieldValue('startDate', date[0]);
                                  setFieldValue('endDate', date[1]);
                                }
                              }}
                              // inputClass="custom"
                              format="YYYY-MM-DD"
                            />
                            {meta.touched && meta.error && <Typography color={'red'}>{meta.error} *</Typography>}
                          </Box>
                        )}
                      </Field>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <Typography variant="h5" py={1}>
                        Start Time
                      </Typography>
                      <Field name="timeStart">
                        {({
                          field,
                          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                          meta
                        }) => (
                          <Box>
                            <TimePicker
                              sx={{ width: '100%' }}
                              label="Start"
                              {...field}
                              onChange={(value) => {
                                setFieldValue('timeStart', value);
                              }}
                            >
                              <TextField {...params} />
                            </TimePicker>
                            {meta.touched && meta.error && <Typography color={'red'}>{meta.error} *</Typography>}
                          </Box>
                        )}
                      </Field>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <Typography variant="h5" py={1}>
                        End Time
                      </Typography>
                      <Field name="timeEnd">
                        {({
                          field,
                          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                          meta
                        }) => (
                          <Box>
                            <TimePicker
                              sx={{ width: '100%' }}
                              label="Start"
                              {...field}
                              onChange={(value) => {
                                setFieldValue('timeEnd', value);
                              }}
                            >
                              <TextField {...params} fullWidth />
                            </TimePicker>
                            {meta.touched && meta.error && <Typography color={'red'}>{meta.error} *</Typography>}
                          </Box>
                        )}
                      </Field>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Stack>
                      <Typography variant="h5" py={1}>
                        Event Address
                      </Typography>
                      <Field name="address">
                        {({
                          field,
                          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                          meta
                        }) => (
                          <Box>
                            <MapPicker
                              key={mapKey}
                              type={params.id ? 'update' : 'default'}
                              initValue={{
                                lat: values.lat,
                                lng: values.lng
                              }}
                              onChangeAddress={(address, lat, lng) => {
                                updateAddress(address, lat, lng);
                              }}
                            />

                            {meta.touched && meta.error && (
                              <Typography pt={1} color={'red'}>
                                {meta.error} *
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Field>
                    </Stack>
                  </Grid>
                </Grid>
              </MainCard>
            </Stack>
          </form>
        );
      }}
    </Formik>
  );
};

export default memo(EventForm);
