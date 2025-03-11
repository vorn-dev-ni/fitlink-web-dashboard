import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Grid, Stack, TextField, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

const SubmissionViewPage = () => {
  const location = useLocation();
  const submission = location.state?.submission; // Get submission data from navigation state

  const [formData, setFormData] = useState({
    contact_name: '',
    phone_number: '',
    email: '',
    address: '',
    trainer_certification: '',
    proof_documents: [],
    submission_date: ''
  });

  const parseSubmissionDate = (submissionDate) => {
    if (submissionDate?.toDate) {
      return submissionDate.toDate().toLocaleString();
    } else if (submissionDate) {
      return submissionDate;
    }
    return '';
  };

  useEffect(() => {
    console.log('Submission Data:', submission); // Debug
    if (submission) {
      setFormData({
        contact_name: submission.contact_name || '',
        phone_number: submission.phone_number || '',
        email: submission.email || '',
        address: submission.address || '',
        trainer_certification: submission.trainer_certification ? 'Yes' : 'No',
        proof_documents: submission.proof_documents || [],
        submission_date: parseSubmissionDate(submission.submission_date)
      });
    }
  }, [submission]);

  return (
    <Stack spacing={4}>
      <MainCard>
        <Grid container spacing={2} py={1}>
          {/* Contact Name */}
          <Grid item xs={6}>
            <Stack spacing={1}>
              <Typography variant="h5" sx={{ color: 'black' }}>
                Contact Name
              </Typography>
              <TextField label="Contact Name" fullWidth value={formData.contact_name} sx={{ input: { color: 'black' } }} />
            </Stack>
          </Grid>

          {/* Phone Number */}
          <Grid item xs={6}>
            <Stack spacing={1}>
              <Typography variant="h5" sx={{ color: 'black' }}>
                Phone Number
              </Typography>
              <TextField label="Phone Number" fullWidth value={formData.phone_number} sx={{ input: { color: 'black' } }} />
            </Stack>
          </Grid>

          {/* Email */}
          <Grid item xs={6}>
            <Stack spacing={1}>
              <Typography variant="h5" sx={{ color: 'black' }}>
                Email
              </Typography>
              <TextField label="Email Address" fullWidth value={formData.email} sx={{ input: { color: 'black' } }} />
            </Stack>
          </Grid>

          {/* Address */}
          <Grid item xs={6}>
            <Stack spacing={1}>
              <Typography variant="h5" sx={{ color: 'black' }}>
                Address
              </Typography>
              <TextField label="Address" fullWidth value={formData.address} sx={{ input: { color: 'black' } }} />
            </Stack>
          </Grid>

          {/* Trainer Certification */}
          <Grid item xs={6}>
            <Stack spacing={1}>
              <Typography variant="h5" sx={{ color: 'black' }}>
                Trainer Certification
              </Typography>
              <TextField
                label="Trainer Certification"
                fullWidth
                value={formData.trainer_certification}
                sx={{ input: { color: 'black' } }}
              />
            </Stack>
          </Grid>

          {/* Proof Documents */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography variant="h5" sx={{ color: 'black' }}>
                Proof Documents
              </Typography>
              {formData.proof_documents.map((document, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ color: 'black' }}>
                    <a href={document} target="_blank" rel="noopener noreferrer" style={{ color: 'black' }}>
                      Document {index + 1}
                    </a>
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* Submission Date */}
          <Grid item xs={6}>
            <Stack spacing={1}>
              <Typography variant="h5" sx={{ color: 'black' }}>
                Submission Date
              </Typography>
              <TextField label="Submission Date" fullWidth value={formData.submission_date} sx={{ input: { color: 'black' } }} />
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    </Stack>
  );
};

export default SubmissionViewPage;
