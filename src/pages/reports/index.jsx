// material-ui

// project import
// project import
import { DatabaseOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AppSnackBar from 'components/SnackBar';
import TableAppBar from 'components/TableAppBar';
import { useEventAction } from 'hooks';
import { useReportData } from 'hooks/events/useReportData';
import AppPageHeader from 'pages/components/AppPageHeader';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { resetScroll } from 'utils/helper';
import ReportTable from './components/ReportTable';

export default function EventPage() {
  const { palette } = useTheme();
  const [sortBy, setSortBy] = useState('desc');
  const [showError, setShowError] = useState(false);
  const [hightLightText, setHighlightText] = useState('');
  const { reports, loading, error: errorReport } = useReportData(sortBy);
  const { handleDeleteEvent } = useEventAction();
  const [localEventState, setLocalReports] = useState([]);
  const navigate = useNavigate();
  const mutateLocalReport = useMemo(() => {
    return reports.filter((item) => item.eventTitle?.toLowerCase()?.includes(hightLightText?.toLowerCase()));
  }, [reports, hightLightText]);
  const handleChange = useCallback(
    (e) => {
      const text = e.target.value;
      setHighlightText(text?.trim());
    },
    [reports]
  );
  const onClickDelete = useCallback(async (data) => {
    setShowError(true);
    await handleDeleteEvent(data.id, data.avatar);
  }, []);

  const onClickEdit = useCallback((data) => {
    const { id } = data;
    navigate(`${id}/edit`);
  }, []);

  useEffect(() => {
    setLocalReports(mutateLocalReport);
  }, [mutateLocalReport]);
  useEffect(() => {
    resetScroll();
  }, []);
  useEffect(() => {
    if (errorReport) {
      setShowError(true);
    }
  }, [errorReport]);

  return (
    <Box component={'div'}>
      <AppSnackBar
        title={errorReport ?? 'Successfully deleted'}
        state={errorReport ? 'failed' : 'success'}
        open={showError}
        handleClose={() => {
          setShowError(false);
        }}
      />
      <AppPageHeader title={'All Reports'}>
        <DatabaseOutlined
          style={{
            fontSize: '25px',
            color: palette.primary.light
          }}
        />
      </AppPageHeader>
      <TableAppBar
        onClickSort={() => {
          const result = sortBy == 'desc' ? 'asc' : 'desc';
          setSortBy(result);
        }}
        handleNavigate={() => {
          navigate('create');
        }}
        handleChangeText={handleChange}
        label={'Events'}
      />
      <ReportTable
        hightLightText={hightLightText}
        events={localEventState}
        loading={loading}
        onEdit={onClickEdit}
        onDelete={onClickDelete}
      />
    </Box>
  );
}
