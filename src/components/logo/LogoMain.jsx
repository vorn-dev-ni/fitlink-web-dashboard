// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';

 *
 */

// ==============================|| LOGO SVG ||============================== //
import logo from 'assets/images/logo/fitlink.png';
import guidelines from 'themes/styles';
const Logo = () => {
  // const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt="Mantis" width="100" />
     *
     */
    <>
      <div style={{ textAlign: 'start' }}>
        <img src={logo} alt="Fitlink" style={guidelines.logoImage} />
      </div>
    </>
  );
};

export default Logo;
