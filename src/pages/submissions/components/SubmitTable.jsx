import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import SimpleLoading from 'components/SimpleLoading';
import AppTable from 'components/tables/AppTable';
import PopoverDialog from 'components/tables/PopoverDialog';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useCallback, useEffect, useMemo, useState } from 'react';
import guidelines from 'themes/styles';
import { db, functions } from 'utils/config/firebase';
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

      // Retrieve receiverID from Firestore based on email
      const usersRef = collection(db, 'users');
      const userQuery = query(usersRef, where('email', '==', receiverEmail));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        console.error('No user found with email:', receiverEmail);
        return false;
      }

      const receiverDoc = querySnapshot.docs[0]; // Assuming emails are unique
      const receiverID = receiverDoc.id; // Firestore document ID (or use receiverDoc.data().uid if stored in DB)

      // Check if sender and receiver have the same user ID
      if (receiverID === user.uid) {
        console.error('Cannot send email to yourself');
        return false;
      }

      // Send Email Notification
      await requestApiData(
        'https://hey-local-be.onrender.com/mail/send-sandbox',
        {
          senderEmail: 'Nightpp19@gmail.com',
          senderPassword: 'coxldawyiohsjbqx',
          companyName: 'FitLink',
          to: receiverEmail,
          subject: 'Submission Update',
          title: `Your submission has been ${newStatus}`,
          text: `Your submission status is now ${newStatus}`,
          description: `We're informing you that your submission has been ${newStatus} by our team.`,
          imageUrl:
            'https://firebasestorage.googleapis.com/v0/b/fitlink-b3d6b.firebasestorage.app/o/images%2Ffitlink-one.jpg?alt=media&token=ba33d84b-6b36-4886-984e-c3c8d701b7a1',
          imageWidth: '175px',
          imageHeight: '175px',
          imageFooterUrl:
            'https://firebasestorage.googleapis.com/v0/b/fitlink-b3d6b.firebasestorage.app/o/images%2Ffitlink-logo-3.jpg?alt=media&token=cdd6ed02-edef-41ac-bba3-42dc70363c0c',
          imageFooterWidth: '75px',
          imageFooterHeight: '75px',
          centerTitle: true,
          centerDescription: true,
          centerImage: true,
          centerFooterImage: true,
          centerBody: true
        },
        'POST'
      );

      // Send Firebase Notification
      // const sendNotification = httpsCallable(functions, 'sendNotificationToSpecificUser');
      // await sendNotification({
      //   eventType: 'submission',
      //   senderID: user.uid, // Admin ID
      //   receiverID: receiverID, // Retrieved user ID
      //   postID: submissionId // Submission/Event ID
      // });

      console.log(user.uid);
      console.log(receiverID);
      console.log(receiverEmail);

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
            sx={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}
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
              '&:hover': { backgroundColor: '#fbc3bc', overflow: 'hidden', borderRadius: '0px' }
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
