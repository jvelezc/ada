'use client';

import { useState } from 'react';
import { Box, ImageList, ImageListItem, Paper, Popper } from '@mui/material';

interface PhotoPreviewHoverProps {
  photos: string[];
  anchorEl: HTMLElement | null;
  open: boolean;
}

export default function PhotoPreviewHover({ photos, anchorEl, open }: PhotoPreviewHoverProps) {
  if (!photos.length) return null;

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="right-start"
      sx={{ zIndex: 1300 }}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ]}
    >
      <Paper
        elevation={8}
        sx={{
          p: 1,
          maxWidth: 320,
          bgcolor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <ImageList cols={2} gap={8} sx={{ width: 300, m: 0 }}>
          {photos.slice(0, 4).map((photo, index) => (
            <ImageListItem key={photo}>
              <img
                src={photo}
                alt={`Location photo ${index + 1}`}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  aspectRatio: '1',
                  objectFit: 'cover',
                  borderRadius: 4,
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Paper>
    </Popper>
  );
}