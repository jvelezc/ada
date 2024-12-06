'use client';

import { IconButton, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';

interface MenuButtonProps {
  onClick: () => void;
}

export default function MenuButton({ onClick }: MenuButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Tooltip title="Menu" placement="right">
        <IconButton
          onClick={onClick}
          sx={{
            position: 'fixed',
            top: 16,
            left: 8,
            zIndex: 1200,
            bgcolor: theme => alpha(theme.palette.background.paper, 0.1),
            backdropFilter: 'blur(8px)',
            color: 'common.white',
            p: 1.5,
            '&:hover': {
              bgcolor: theme => alpha(theme.palette.background.paper, 0.15),
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <MenuIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Tooltip>
    </motion.div>
  );
}