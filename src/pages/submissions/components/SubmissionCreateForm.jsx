import { UploadOutlined } from '@ant-design/icons';
import { Box, Container, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MainCard from 'components/MainCard';
import { useDropzone } from 'react-dropzone';

const SubmissionCreateForm = () => {
  const { palette } = useTheme();
  const onDrop = (acceptedFiles) => {
    console.log(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    },
    multiple: false
  });
  return (
    <Stack spacing={4}>
      <MainCard>
        <Grid container spacing={2} py={1}>
          <Grid item xs={6}>
            <Stack spacing={1}>
              <Typography variant="h5">Contact Name</Typography>
              <TextField
                label="Contact Name"
                fullWidth
                // id="fullWidth"
              />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={1}>
              <Typography variant="h5">Telephone</Typography>
              <TextField
                label="Telephone"
                fullWidth
                // id="fullWidth"
              />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={1}>
              <Typography variant="h5">Email</Typography>
              <TextField
                label="Email Address"
                fullWidth
                // id="fullWidth"
              />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={1}>
              <Typography variant="h5">Address</Typography>
              <TextField
                label="Address"
                fullWidth
                // id="fullWidth"
              />
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
      <MainCard>
        <Grid container spacing={2} py={1}>
          <Grid item xs={6}>
            <Stack spacing={1}>
              <Typography variant="h5">Certificate</Typography>
              <FormControl>
                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                  <FormControlLabel value="other" control={<Radio />} label="Other" />
                </RadioGroup>
              </FormControl>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={1}>
              <Typography variant="h5">Upload File</Typography>
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
                    backgroundColor: 'rgb(241, 246, 254)'
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
        </Grid>
      </MainCard>
    </Stack>
  );
};

export default SubmissionCreateForm;
