'use client';

import { useState, useEffect } from 'react';
import { Fab, Box, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';
import { supabase } from '@/lib/supabase';

export default function AddLocationButton() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!user) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 1000,
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
              background: (theme) => `linear-gradient(45deg, 
                ${theme.palette.primary.dark} 0%,
                ${theme.palette.primary.main} 100%
              )`,
              border: '3px solid black',
              '&:hover': {
                background: (theme) => `linear-gradient(45deg, 
                  ${theme.palette.primary.main} 0%,
                  ${theme.palette.primary.light} 100%
                )`,
              },
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                type: "spring",
                stiffness: 200
              }}
            >
              <AddIcon sx={{ fontSize: 32 }} />
            </motion.div>
          </Fab>
        </motion.div>
      </Tooltip>
    </Box>
  );
}