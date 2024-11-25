'use client';

import { Fab, Box, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AddLocationButton() {
  const router = useRouter();

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 2000,
      }}
    >
      <Tooltip title="Add New Location" placement="left">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15
          }}
        >
          <Fab
            color="primary"
            aria-label="add location"
            onClick={() => router.push('/add')}
            size="large"
            sx={{
              width: 64,
              height: 64,
              background: (theme) => `linear-gradient(45deg, 
                ${theme.palette.primary.dark} 0%,
                ${theme.palette.primary.main} 100%
              )`,
              boxShadow: (theme) => `0 4px 20px ${theme.palette.primary.main}40`,
              border: '2px solid',
              borderColor: 'primary.light',
              '&:hover': {
                background: (theme) => `linear-gradient(45deg, 
                  ${theme.palette.primary.main} 0%,
                  ${theme.palette.primary.light} 100%
                )`,
              },
            }}
          >
            <AddIcon sx={{ fontSize: 32 }} />
          </Fab>
        </motion.div>
      </Tooltip>
    </Box>
  );
}