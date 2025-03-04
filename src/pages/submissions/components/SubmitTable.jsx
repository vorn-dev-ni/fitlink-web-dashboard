import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import SimpleLoading from 'components/SimpleLoading';
import AppTable from 'components/tables/AppTable';
import PopoverDialog from 'components/tables/PopoverDialog';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import guidelines from 'themes/styles';
import { db } from 'utils/config/firebase';
import useStyles from '../Submission.style';
import { useAtomValue } from 'jotai';
import { useApi } from 'api';
import { userAtom } from 'atom';

const displayColumns = ['Unique ID', 'Email', 'Name', 'Status', 'Document', 'Date'];

export default function SubmitTables({ formEvents, loading }) {
  const [pageState, setPageState] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const theme = useTheme();
  const open = Boolean(anchorEl);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissionId, setSubmissionId] = useState('');
  const { requestApiData } = useApi();
  const user = useAtomValue(userAtom);
  const [receiverEmail, setReceiverEmail] = useState('');
  const handleClick = (event, rowData) => {
    // alert('click asdsa', JSON.stringify(rowData.id));

    // console.log('click ', rowData);
    setAnchorEl(event.currentTarget);
    setSelectedSubmission(rowData.id);
    setSubmissionId(rowData.id);
    setReceiverEmail(rowData.email);
  };
  const updateSubmissionAndUser = async (submissionId, newStatus, receiverEmail) => {
    try {
      if (!submissionId || typeof submissionId !== 'string') {
        console.error('Invalid submission ID:', submissionId);
        return false;
      }

      const submissionRef = doc(db, 'submissions', submissionId);
      const submissionSnap = await getDoc(submissionRef);

      if (!submissionSnap.exists()) {
        console.error('Submission does not exist. ID:', submissionId);
        return false;
      }

      await updateDoc(submissionRef, { status: newStatus });
      // await requestApiData(
      //   'https://hey-local-be.onrender.com/mail/send-sandbox',
      //   {
      //     senderEmail: 'Nightpp19@gmail.com',
      //     senderPassword: 'wkajsdak2ks',
      //     companyName: 'FitLink',
      //     to: receiverEmail,
      //     subject: 'Welcome',
      //     title: 'Welcome to our service!',
      //     text: 'Hello, this is a test message.',
      //     description: 'We are excited to have you.',
      //     imageUrl: 'https://example.com/image.png',
      //     imageWidth: '175px',
      //     imageHeight: '175px',
      //     imageFooterUrl: 'https://example.com/footer.png',
      //     imageFooterWidth: '75px',
      //     imageFooterHeight: '75px',
      //     centerTitle: true,
      //     centerDescription: true,
      //     centerImage: true,
      //     centerFooterImage: true,
      //     centerBody: true
      //   },
      //   'POST'
      // );
      // const sendNotification = httpsCallable(functions, 'sendNotificationToSpecificUser');
      // // react firebase query where , where email = receiverEmail and then get the user id ;
      // //  const { eventType, senderID, receiverID, postID } = data;
      // await sendNotification({
      //   eventType: 'submission',
      //   senderID: user.uid, // Admin id or the current
      //   receiverID: '', // User id that u want tto send
      //   postID: submissionId // Event Id
      // });
      return true;
    } catch (error) {
      console.error('Error updating submission:', error);
      return false;
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApprove = async () => {
    if (!selectedSubmission) {
      console.error('No submission selected');
      return;
    }
    await updateSubmissionAndUser(selectedSubmission, 'approved', receiverEmail);
    handleClose();
  };

  const handleReject = async () => {
    if (!selectedSubmission) {
      console.error('No submission selected');
      return;
    }
    await updateSubmissionAndUser(selectedSubmission, 'rejected', receiverEmail);
    handleClose();
  };

  const getColorStatus = useCallback((item) => {
    switch (item) {
      case 'pending':
        return 'gray';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return theme.palette.common.black;
    }
  }, []);
  const getRows = useMemo(() => {
    return formEvents.map((form) => {
      return {
        ...form,
        color: getColorStatus(form?.status)
      };
    });
  }, [formEvents]);

  const getColumns = useMemo(() => {
    if (formEvents?.length > 0) {
      const dataKeys = Object.keys(formEvents[0]);

      return dataKeys.map((item, index) => ({
        id: item,
        label: displayColumns[index] || item, // Fallback to key name if no display column is found
        minWidth: 100,
        isLink: ['WebSite', 'Document'].includes(displayColumns[index] || ''),
        document: ['Document'].includes(displayColumns[index] || '')
      }));
    }

    return displayColumns.map((item, index) => ({
      id: item,
      label: item, // Ensure label is defined
      minWidth: 100,
      isLink: ['WebSite', 'Document'].includes(item),
      document: ['Document'].includes(item)
    }));
  }, [formEvents]);

  useEffect(() => {
    let timeOut;
    if (!loading) {
      timeOut = setTimeout(() => {
        setPageState(loading);
      }, 400);
    }
    return () => clearTimeout(timeOut);
  }, [loading]);
  if (pageState) {
    return <SimpleLoading height="50vh" />;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: guidelines.spacing.py25 }}>
      <PopoverDialog open={open} anchorEl={anchorEl} handleClose={handleClose}>
        <Stack className={classes.stackContainer}>
          <Button
            onClick={handleApprove}
            className={classes.button}
            variant="text"
            sx={{
              alignItems: 'flex-start',
              justifyContent: 'flex-start'
            }}
          >
            <Stack direction={'row-reverse'} alignItems={'center'} justifyContent={'flex-start'} spacing={1}>
              <Typography variant="body1">Approved</Typography>
              <CheckOutlined />
            </Stack>
          </Button>
          <Button
            sx={{
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              '&:hover': {
                backgroundColor: '#fbc3bc',
                overflow: 'hidden',
                borderRadius: '0px'
              }
            }}
            onClick={handleReject}
            className={classes.button}
            variant="text"
          >
            <Stack direction={'row-reverse'} alignItems={'center'} spacing={1} justifyContent={'flex-start'}>
              <Typography variant="body1" color={'red'}>
                Reject
              </Typography>
              <CloseOutlined style={{ color: 'red' }} />
            </Stack>
          </Button>
        </Stack>
      </PopoverDialog>
      <AppTable columns={getColumns} rows={getRows} rowsPerPageOptions={[5, 10]} handleClickAction={handleClick} initialRowsPerPage={5} />
    </Paper>
  );
}
