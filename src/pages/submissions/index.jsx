// material-ui
// project import
import { FormOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TableAppBar from 'components/TableAppBar';
import AppPageHeader from 'pages/components/AppPageHeader';
import SubmitTables from './components/SubmitTable';
import { Outlet, useNavigate } from 'react-router';
import { useSubmissions } from 'hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function SubmitPage() {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const { formEvents, loading } = useSubmissions();
  const [sortBy, setSortBy] = useState('desc');
  const [hightLightText, setHighlightText] = useState('');
  const [localStateSubmissions, setLocalStateSubmissions] = useState([]);

  // Filter and sort submissions
  const mutateSubmissionsState = useMemo(() => {
    const sorted = [...formEvents].sort((a, b) =>
      sortBy === 'desc'
        ? new Date(b.submission_timestamp) - new Date(a.submission_timestamp)
        : new Date(a.submission_timestamp) - new Date(b.submission_timestamp)
    );

    return sorted.filter(
      (item) =>
        item.contact_name?.toLowerCase()?.includes(hightLightText?.toLowerCase()) ||
        item.email?.toLowerCase()?.includes(hightLightText?.toLowerCase())
    );
  }, [formEvents, hightLightText, sortBy]);

  // Update local state when filtered data changes
  useEffect(() => {
    setLocalStateSubmissions(mutateSubmissionsState);
  }, [mutateSubmissionsState]);

  // Handle search input change
  const onChangeText = useCallback((e) => {
    const text = e.target.value;
    setHighlightText(text?.trim());
  }, []);

  // Handle sort toggle
  const handleSort = useCallback(() => {
    setSortBy((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  }, []);

  return (
    <Box>
      <AppPageHeader title={'All Submissions'}>
        <FormOutlined style={{ fontSize: '25px', color: palette.primary.light }} />
      </AppPageHeader>

      <TableAppBar
        onClickSort={handleSort}
        handleChangeText={onChangeText}
        label={'Submission'}
        handleNavigate={() => navigate('/submissions/create')}
      />

      <SubmitTables formEvents={localStateSubmissions} loading={loading} hightLightText={hightLightText} />
      <Outlet />
    </Box>
  );
}
