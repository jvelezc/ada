'use client';

import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Box,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SuccessDialog({ open, onClose }: SuccessDialogProps) {
  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
        },
      }}
    >
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 3 }}>
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
              }}
            />
          </motion.div>

          <Typography variant="h5" gutterBottom>
            Location Updated Successfully
          </Typography>
          <Typography color="text.secondary" paragraph>
            The location has been updated and the changes are now live.
          </Typography>

          <Button
            variant="contained"
            onClick={onClose}
            sx={{ mt: 2 }}
          >
            Return to Admin Panel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}