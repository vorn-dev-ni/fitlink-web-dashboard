// assets
import {
  AntDesignOutlined,
  AppstoreAddOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  ChromeOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  FormOutlined,
  CarryOutOutlined
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
  FormOutlined,
  CarryOutOutlined
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
      id: 'report',
      title: 'Reports',
      type: 'item',
      url: '/reports',
      icon: icons.CarryOutOutlined,
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
