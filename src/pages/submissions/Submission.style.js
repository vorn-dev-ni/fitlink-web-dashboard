// Button.styles.js
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  button: {
    justifyContent: 'flex-start',
    '.MuiTouchRipple-child': {
      backgroundColor: 'red !important'
    }
  },
  stackContainer: {
    width: 120
  },
  root: {
    '.MuiTouchRipple-child': {
      backgroundColor: 'red'
    }
  }
}));

export default useStyles;
