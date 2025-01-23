import { fontSizeStyles } from './styles/fontSize';
import { globalStyles } from './styles/global';
import { spacingStyles } from './styles/spacing';

const guidelines = {
  ...globalStyles,
  ...spacingStyles,
  ...fontSizeStyles
};

export default guidelines;
