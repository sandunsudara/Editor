import { lazy } from 'react';

// project imports
import MainLayout from '../layout/MainLayout/index';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const TemplatePage = Loadable(lazy(() => import('../views/pages/template/template')));
const DomainPage = Loadable(lazy(() => import('../views/pages/domain/domain.jsx')));



// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'template',
      element: <TemplatePage />
    },
    {
      path: 'domain',
      element: <DomainPage />
    },


  ]
};

export default MainRoutes;
