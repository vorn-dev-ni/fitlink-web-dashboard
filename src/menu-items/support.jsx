// assets
import {
  AntDesignOutlined,
  AppstoreAddOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  ChromeOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  QuestionOutlined
} from '@ant-design/icons';

// icons
const icons = {
  QuestionOutlined,
  AntDesignOutlined,
  AppstoreAddOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  ChromeOutlined,
  FontSizeOutlined,
  LoadingOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

// const support = {
//   id: 'support',
//   title: 'Support',
//   type: 'group',
//   children: [
//     {
//       id: 'sample-page',
//       title: 'Sample Page',
//       type: 'item',
//       url: '/sample-page',
//       icon: icons.ChromeOutlined
//     },
//     {
//       id: 'documentation',
//       title: 'Documentation',
//       type: 'item',
//       url: 'https://codedthemes.gitbook.io/mantis/',
//       icon: icons.QuestionOutlined,
//       external: true,
//       target: true
//     }
//   ]
// };
const support = {
  id: 'examples',
  title: 'Examples',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Typography',
      type: 'item',
      url: '/typography',
      icon: icons.FontSizeOutlined
    },
    {
      id: 'util-color',
      title: 'Color',
      type: 'item',
      url: '/color',
      icon: icons.BgColorsOutlined
    },
    {
      id: 'util-shadow',
      title: 'Shadow',
      type: 'item',
      url: '/shadow',
      icon: icons.BarcodeOutlined
    }
  ]
};

export default support;
