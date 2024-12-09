'use client';

import { Box, IconButton, Tooltip, alpha, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import { motion } from 'framer-motion';

interface PhotoThumbnailProps {
  url: string;
  onView: () => void;
  onDelete?: () => void;
  editable?: boolean;
}

export default function PhotoThumbnail({ 
  url, 
  onView, 
  onDelete,
  editable = false 
}: PhotoThumbnailProps) {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Box
        sx={{ 
          position: 'relative',
          width: '100%',
          paddingTop: '75%', // 4:3 aspect ratio
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          boxShadow: theme => `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
          '&:hover .photo-overlay': {
            opacity: 1,
          },
        }}
      >
        <img
          src={url}
          alt="Location"
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box
          className="photo-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: alpha(theme.palette.common.black, 0.6),
            opacity: 0,
            transition: 'opacity 0.2s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              sx={{ 
                color: 'white',
                bgcolor: alpha(theme.palette.common.white, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.common.white, 0.2),
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ZoomOutMapIcon />
            </IconButton>
          </Tooltip>
          {editable && onDelete && (
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                sx={{ 
                  color: 'white',
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.error.main, 0.2),
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}