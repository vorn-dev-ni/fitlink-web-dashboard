// material-ui
// project import
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Box, Button, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SubmissionCreateForm from './SubmissionCreateForm';
import { useNavigate } from 'react-router';
export default function SubmissionCreate() {
  // const currUser = auth;
  const { palette } = useTheme();
  const navigate = useNavigate();
  return (
    <Box>
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
        <Button variant="outlined" startIcon={<SaveOutlined />} sx={{}}>
          Save
        </Button>
      </Stack>

      <SubmissionCreateForm />
    </Box>
  );
}
