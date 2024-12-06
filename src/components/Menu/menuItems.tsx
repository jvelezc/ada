import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { MenuItemType } from './types';

export const menuItems: MenuItemType[] = [
  { 
    id: 'home',
    text: 'Home', 
    icon: <HomeIcon />, 
    path: '/',
    requiresAuth: false
  },
  { 
    id: 'admin',
    text: 'Admin Panel', 
    icon: <AdminPanelSettingsIcon />, 
    path: '/admin',
    requiresAuth: true
  },
];