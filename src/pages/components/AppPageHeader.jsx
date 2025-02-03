import { Stack } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import guidelines from 'themes/styles';
import Typography from '@mui/material/Typography';
import React from 'react';

const AppPageHeader = ({ title, children }) => {
  const { palette } = useTheme();
  return (
    <Stack direction={'row'} spacing={guidelines.spacing.px10} alignItems={'center'}>
      {children}
      <Typography color={palette.primary.light} variant="h4">
        {title}
      </Typography>
    </Stack>
  );
};

export default AppPageHeader;
