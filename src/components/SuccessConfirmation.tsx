'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, Typography, Button, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from 'next/navigation';

interface SuccessConfirmationProps {
  open: boolean;
  onClose: () => void;
}

export default function SuccessConfirmation({ open, onClose }: SuccessConfirmationProps) {
  const router = useRouter();
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleViewMap = () => {
    router.push('/');
    onClose();
  };

  const handleAddAnother = () => {
    router.refresh();
    onClose();
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          overflow: 'hidden',
        },
      }}
    >
      {open && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      
      <DialogContent sx={{ textAlign: 'center', py: 6, px: 4 }}>
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <CheckCircleIcon 
              sx={{ 
                fontSize: 80,
                color: 'success.main',
                mb: 3,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
              }} 
            />
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Typography variant="h4" gutterBottom>
            Thank You! 🎉
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Your location has been successfully submitted and will be reviewed by our team.
          </Typography>
        </motion.div>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleViewMap}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              boxShadow: theme => `0 4px 20px ${theme.palette.primary.main}40`,
            }}
          >
            View Map
          </Button>
          <Button
            variant="outlined"
            onClick={handleAddAnother}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
            }}
          >
            Add Another Location
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}