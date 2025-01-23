// assets
import { LoginOutlined, ProfileOutlined, UserOutlined, CodeOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  UserOutlined,
  CodeOutlined
};

const pages = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [
    {
      id: 'user',
      title: 'Users',
      type: 'item',
      url: '/users',
      icon: icons.UserOutlined,
      target: false
    }
  ]
};

export default pages;
