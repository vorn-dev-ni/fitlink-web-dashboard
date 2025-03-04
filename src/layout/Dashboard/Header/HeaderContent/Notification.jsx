import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { BellOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
  Badge,
  ClickAwayListener,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Popper,
  Tooltip,
  Typography,
  Box,
  Avatar
} from '@mui/material';
import { useSubmissions } from 'hooks';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import { GiftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate } from 'react-router-dom';

dayjs.extend(relativeTime);

export default function Notification() {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const { formEvents } = useSubmissions();
  const navigate = useNavigate();

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [readCount, setReadCount] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [seenIds, setSeenIds] = useState(new Set());

  // Reset seenIds when the component mounts
  useEffect(() => {
    setSeenIds(new Set());
  }, []);

  // Convert submission_date to a comparable value (timestamp in milliseconds)
  const getSubmissionTimestamp = (submission) => {
    if (submission.submission_date?.toDate) {
      // If it's a Firestore Timestamp
      return submission.submission_date.toDate().getTime();
    } else if (submission.submission_date) {
      // If it's a string, parse it with dayjs
      return dayjs(submission.submission_date).valueOf();
    }
    return 0; // Fallback for invalid dates
  };

  // Sort submissions by date descending and filter new ones
  const sortedSubmissions = [...formEvents].sort((a, b) => getSubmissionTimestamp(b) - getSubmissionTimestamp(a));

  const newSubmissions = sortedSubmissions.filter((submission) => submission.status === 'pending' && !seenIds.has(submission.id));

  // Update read count when submissions change
  useEffect(() => {
    setReadCount(newSubmissions.length);
  }, [formEvents, seenIds]);

  const handleToggle = () => {
    setOpen((prevOpen) => {
      if (!prevOpen) {
        // Mark all current new submissions as seen when opening
        const newSeen = new Set([...seenIds, ...newSubmissions.map((s) => s.id)]);
        setSeenIds(newSeen);
        setReadCount(0); // Reset the notification count
      }
      return !prevOpen;
    });
  };

  const handleClose = (event) => {
    if (anchorRef.current?.contains(event.target)) return;
    setOpen(false);
  };

  const handleMarkAllAsRead = () => {
    const allIds = new Set([...seenIds, ...formEvents.map((s) => s.id)]);
    setSeenIds(allIds);
    setReadCount(0);
  };

  const handleNotificationClick = (submission) => {
    console.log('Clicked Submission:', submission); // Debug
    navigate('/submissions/view', { state: { submission } });
  };

  // sx styles
  const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
  };

  const actionSX = {
    mt: '6px',
    ml: 1,
    alignSelf: 'flex-start',
    transform: 'none'
  };

  const iconBackColorOpen = 'grey.100';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : 'transparent' }}
        ref={anchorRef}
        onClick={handleToggle}
      >
        <Badge badgeContent={readCount} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>

      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [matchesXs ? -5 : 0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: theme.customShadows.z1, width: '100%', minWidth: 285, maxWidth: { xs: 285, md: 420 } }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notifications"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    readCount > 0 && (
                      <Tooltip title="Mark all as read">
                        <IconButton color="success" size="small" onClick={handleMarkAllAsRead}>
                          <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                >
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      '& .MuiListItemButton-root': {
                        py: 0.5,
                        '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' },
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                      }
                    }}
                  >
                    {(showAll ? sortedSubmissions.slice(0, 8) : newSubmissions.slice(0, 8)).map((submission) => (
                      <React.Fragment key={submission.id}>
                        <ListItemButton onClick={() => handleNotificationClick(submission)}>
                          <ListItemAvatar>
                            <Avatar sx={{ color: 'info.main', bgcolor: 'info.lighter' }}>
                              <GiftOutlined />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="h6">
                                New submission from{' '}
                                <Typography component="span" variant="subtitle1">
                                  {submission.contact_name}
                                </Typography>
                              </Typography>
                            }
                            secondary={dayjs(submission.submission_date).format('DD MMM YYYY, hh:mm A')}
                          />
                          <ListItemSecondaryAction>
                            <Typography variant="caption" noWrap>
                              {dayjs(submission.submission_date).fromNow()}
                            </Typography>
                          </ListItemSecondaryAction>
                        </ListItemButton>
                        <Divider />
                      </React.Fragment>
                    ))}
                    <ListItemButton sx={{ textAlign: 'center', py: `${12}px !important` }} onClick={() => setShowAll((prev) => !prev)}>
                      <ListItemText
                        primary={
                          <Typography variant="h6" color="primary">
                            {showAll ? 'Show New Only' : 'View All'}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
