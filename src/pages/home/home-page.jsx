// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';


export default function HomePage() {
  return (
    <MainCard title="Sample Card">
      <Typography variant="body2">
        Welcome to Home Page
      </Typography>
    </MainCard>
  );
}
