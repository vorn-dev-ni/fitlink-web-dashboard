// assets
import {
  AntDesignOutlined,
  AppstoreAddOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  ChromeOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  FormOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  ChromeOutlined,
  FormOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const features = {
  id: 'feature',
  title: 'Features',
  type: 'group',
  children: [
    {
      id: 'event',
      title: 'Events',
      type: 'item',
      url: '/events',
      icon: icons.ChromeOutlined,
      target: false
    },
    {
      id: 'form_approval',
      title: 'Submission',
      type: 'item',
      url: '/submissions',
      icon: icons.FormOutlined,
      target: false
    }
  ]
};

export default features;
