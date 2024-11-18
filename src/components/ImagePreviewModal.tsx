'use client';

import { Dialog, DialogContent, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

interface ImagePreviewModalProps {
  open: boolean;
  onClose: () => void;
  image: {
    src: string;
    title: string;
    description: string;
  };
}

export default function ImagePreviewModal({ open, onClose, image }: ImagePreviewModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper',
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 1,
          color: 'white',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0, position: 'relative', aspectRatio: '16/9' }}>
        <Image
          src={image.src}
          alt={image.title}
          fill
          style={{ objectFit: 'cover' }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            color: 'white',
          }}
        >
          <Typography variant="h6" gutterBottom>
            {image.title}
          </Typography>
          <Typography variant="body2">
            {image.description}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}