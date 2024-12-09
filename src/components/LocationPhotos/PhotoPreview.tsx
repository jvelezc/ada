'use client';

import { Dialog, DialogContent, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface PhotoPreviewProps {
  photo: string | null;
  onClose: () => void;
}

export default function PhotoPreview({ photo, onClose }: PhotoPreviewProps) {
  if (!photo) return null;

  return (
    <Dialog
      open={!!photo}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { 
          bgcolor: 'background.paper',
          position: 'relative',
        }
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'white',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            width: '100%',
            height: '80vh',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <img
            src={photo}
            alt="Location preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}