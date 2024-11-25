'use client';

import { Dialog, DialogContent, Typography, Button, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from 'next/navigation';

interface SuccessConfirmationProps {
  open: boolean;
  onClose: () => void;
}

export default function SuccessConfirmation({ open, onClose }: SuccessConfirmationProps) {
  const router = useRouter();

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
          position: 'relative',
        },
      }}
    >
      <DialogContent sx={{ textAlign: 'center', py: 6, px: 4 }}>
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
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