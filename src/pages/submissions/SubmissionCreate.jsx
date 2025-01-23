// material-ui
// project import
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Box, Button, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SubmissionCreateForm from './SubmissionCreateForm';
import { useNavigate } from 'react-router';
import SimpleLoading from 'components/SimpleLoading';
import { useEffect, useState } from 'react';
export default function SubmissionCreate() {
  // const currUser = auth;
  const { palette } = useTheme();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState(true);
  useEffect(() => {
    const timeoutId = setTimeout(() => setPageState(false), 400);
    return () => clearTimeout(timeoutId);
  }, []);
  if (pageState) {
    return <SimpleLoading />;
  }
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
