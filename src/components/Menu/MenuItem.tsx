'use client';

import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';

interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}

export default function MenuItem({ icon, text, onClick }: MenuItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <ListItem
        onClick={onClick}
        sx={{
          py: 1.5,
          px: 2,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'primary.dark',
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
              color: 'primary.contrastText',
            },
          },
        }}
      >
        <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
          {icon}
        </ListItemIcon>
        <ListItemText 
          primary={text}
          primaryTypographyProps={{
            sx: { color: 'text.primary' }
          }}
        />
      </ListItem>
    </motion.div>
  );
}