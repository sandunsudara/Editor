// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const normalItem = {
  id: 'dashboard',
  // title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'editor',
      title: 'Editor',
      type: 'item',
      url: '/template',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
    ,{
      id: 'domain',
      title: 'Domain',
      type: 'item',
      url: '/domain',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default normalItem;
