import { ArrowLeftOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Box, Button, Container, Grid, InputAdornment, IconButton, Stack, TextField, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import { userAtomFormValues } from 'atom';
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import AppSnackBar from 'components/SnackBar';
import { Field, Formik } from 'formik';
import { useAuthAction, useStorage } from 'hooks';
import { useAtom } from 'jotai';
import { memo, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate, useParams } from 'react-router';
import { getFilePathFromUrl, trimWhiteSpace } from 'utils/helper';
import { userInitialValues, userValidationSchema } from 'utils/validator/user';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const defaultMutateState = {
  title: '',
  type: 'success',
  showSnackBar: false
};
const UserForm = () => {
  const { palette } = useTheme();
  const params = useParams();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState({
    file: null,
    image: ''
  });
  const [userInitState, setuserInitState] = useAtom(userAtomFormValues);
  const [mutateState, setMutateState] = useState(defaultMutateState);
  const [showPassword, setShowPassword] = useState(false);
  const { handleUpdateCreate, error: userError, isLoading } = useAuthAction();
  const { uploadFile, imageError, deleteFile } = useStorage();
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles) {
      const imageUrl = URL.createObjectURL(acceptedFiles[0]);
      setPreviewImage({ file: acceptedFiles, image: imageUrl });
    }
  };
  const handleClickShowPassword = useCallback(() => {
    setShowPassword((pre) => !pre);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    multiple: false
  });
  const handleSubmitUser = async (values, actions) => {
    try {
      const firstName = trimWhiteSpace(values.firstName);
      const lastName = trimWhiteSpace(values.lastName);
      const trimEmail = trimWhiteSpace(values.email);
      let downloadUrl = '';
      actions.setSubmitting(true);
      if (previewImage.file != null) {
        downloadUrl = await uploadFile(previewImage.file[0], 'images');
        if (userInitState.avatar) {
          const file = getFilePathFromUrl(userInitState.avatar);
          await deleteFile(file);
        }
      }
      await handleUpdateCreate(params.id, {
        ...values,
        email: trimEmail,
        fullName: firstName + ' ' + lastName,
        avatar: downloadUrl || previewImage.image
      });

      if (!params.id) {
        console.log('true resetting now');
        actions.resetForm();
        setuserInitState(userInitialValues);
        setPreviewImage({
          file: null,
          image: ''
        });
        //Only reset if user is creating only
      }
      setMutateState({
        showSnackBar: true,
        type: 'success',
        title: 'Saved changes has been completed!!!'
      });

      actions.setSubmitting(false);
    } catch (error) {
      console.error(error);
      setMutateState({
        type: 'failed',
        title: error.toString(),
        showSnackBar: true
      });
    } finally {
    }
  };

  useEffect(() => {
    if (imageError || userError) {
      setMutateState({
        showSnackBar: true,
        type: 'failed',
        title: imageError || userError
      });
    }
  }, [userError, imageError]);

  useEffect(() => {
    setPreviewImage((pre) => ({ ...pre, image: userInitState.avatar }));
  }, [userInitState]);

  return (
    <Formik enableReinitialize initialValues={userInitState} validationSchema={userValidationSchema} onSubmit={handleSubmitUser}>
      {({ handleSubmit, isSubmitting }) => (
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
                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                      <Typography variant="h5">Upload Avatar</Typography>

                      <Typography variant="h6" color={'red'}>
                        {' '}
                        *Optional
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        width: '100%'
                      }}
                    >
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
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <Stack spacing={1}>
                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                      <Typography variant="h5">Preview Image</Typography>
                    </Stack>
                    <Box
                      sx={{
                        width: '100%'
                      }}
                    >
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
                      First name
                    </Typography>
                    <Field name="firstName">
                      {({
                        field,
                        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                        meta
                      }) => (
                        <Box>
                          <TextField label="Enter user first name" fullWidth {...field} />

                          {meta.touched && meta.error && <Typography color={'red'}>{meta.error} *</Typography>}
                        </Box>
                      )}
                    </Field>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <Typography py={1} variant="h5">
                      Last Name
                    </Typography>
                    <Field name="lastName">
                      {({
                        field,
                        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                        meta
                      }) => (
                        <Box>
                          <TextField label="Enter user last name" fullWidth {...field} />
                          {meta.touched && meta.error && <Typography color={'red'}>{meta.error} *</Typography>}
                        </Box>
                      )}
                    </Field>
                  </Stack>
                </Grid>

                <Grid item xs={3}>
                  <Stack spacing={1}>
                    <Typography py={1} variant="h5">
                      Email
                    </Typography>
                    <Field name="email">
                      {({
                        field,
                        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                        meta
                      }) => (
                        <Box>
                          <TextField label="Enter user email" fullWidth {...field} disabled={userInitState.phone ? true : false} />
                          {meta.touched && meta.error && <Typography color={'red'}>{meta.error} *</Typography>}
                        </Box>
                      )}
                    </Field>
                  </Stack>
                </Grid>

                <Grid item xs={3}>
                  <Stack spacing={1}>
                    <Typography variant="h5" py={1}>
                      Password
                    </Typography>

                    <Field name="password">
                      {({
                        field,
                        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                        meta
                      }) => (
                        <Box>
                          <TextField
                            // disabled={params.id ? true : false}
                            label="Enter user password"
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            {...field}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={handleClickShowPassword} edge="end">
                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                            // id="fullWidth"
                          />
                          {meta.touched && meta.error && <Typography color={'red'}>{meta.error} *</Typography>}
                        </Box>
                      )}
                    </Field>
                  </Stack>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="h5" py={1.5}>
                    User Role
                  </Typography>
                  <Field name="role">
                    {({
                      field,
                      form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                      meta
                    }) => (
                      <FormControl size="medium" fullWidth>
                        <InputLabel id="user-role-select">Select role</InputLabel>
                        <Select label="Role" labelId="user-role-select" id="user-role-select" {...field} fullWidth>
                          <MenuItem value={'normal'}>Regular</MenuItem>
                          <MenuItem value={'admin'}>Administration</MenuItem>
                          <MenuItem value={'gym-trainer'}>Gym trainer / Owner</MenuItem>
                        </Select>
                        {meta.touched && meta.error && <Typography color={'red'}>{meta.error} *</Typography>}
                      </FormControl>
                    )}
                  </Field>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <Typography py={1} variant="h5" color={'gray'}>
                      Phone Number
                    </Typography>
                    <Field name="phone" disabled>
                      {({
                        field,
                        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                        meta
                      }) => (
                        <Box>
                          <TextField label="Enter phone number" fullWidth {...field} disabled />
                          {meta.touched && meta.error && <Typography color={'red'}>{meta.error} *</Typography>}
                        </Box>
                      )}
                    </Field>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <Typography variant="h5" py={1}>
                      Bio
                    </Typography>
                    <Field name="bio">
                      {({
                        field,
                        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                        meta
                      }) => (
                        <Box>
                          <TextField
                            label="Enter user bio"
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
              </Grid>
            </MainCard>
          </Stack>
        </form>
      )}
    </Formik>
  );
};

export default memo(UserForm);
