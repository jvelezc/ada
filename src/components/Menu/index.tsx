'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import MenuButton from './MenuButton';
import MenuDrawer from './MenuDrawer';
import AuthDialog from './AuthDialog';
import { menuItems } from './menuItems';

export default function Menu() {
  const [open, setOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleNavigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLogin = () => {
    setAuthDialogOpen(true);
    setOpen(false);
  };

  const visibleMenuItems = menuItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && user)
  );

  return (
    <>
      <MenuButton onClick={() => setOpen(true)} />
      <MenuDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={visibleMenuItems}
        onItemClick={handleNavigate}
        onLogout={handleLogout}
        onLogin={handleLogin}
        showLogout={!!user}
        showLogin={!user}
      />
      <AuthDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
      />
    </>
  );
}