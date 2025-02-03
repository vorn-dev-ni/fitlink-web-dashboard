import { Typography } from '@mui/material';
import { memo } from 'react';

const HighlightText = ({ text, highlight }) => {
  console.log('text', highlight);
  const index = typeof text === 'string' ? text.toLowerCase().indexOf(highlight?.toLowerCase() || '') : -1;

  if (index === -1) return <Typography>{text}</Typography>;

  return (
    <Typography>
      {text?.substring(0, index)}
      <span style={{ backgroundColor: 'yellow', color: 'black' }}>{text?.substring(index, index + highlight?.length)}</span>
      {text?.substring(index + highlight?.length)}
    </Typography>
  );
};
export default memo(HighlightText);
