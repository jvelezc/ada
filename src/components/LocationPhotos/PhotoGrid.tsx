'use client';

import { ImageList, ImageListItem, useMediaQuery, useTheme } from '@mui/material';
import { LocationPhoto } from '@/types/photos';
import PhotoThumbnail from './PhotoThumbnail';

interface PhotoGridProps {
  photos: LocationPhoto[];
  onPhotoSelect: (url: string) => void;
  onPhotoDelete?: (photoId: number) => Promise<void>;
  editable?: boolean;
}

export default function PhotoGrid({ 
  photos, 
  onPhotoSelect, 
  onPhotoDelete,
  editable = false 
}: PhotoGridProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ImageList 
      cols={isMobile ? 2 : 3} 
      gap={16}
      sx={{
        m: 0,
        width: '100%',
        height: 'auto',
        '& .MuiImageListItem-root': {
          overflow: 'hidden',
        },
      }}
    >
      {photos.map((photo) => (
        <ImageListItem key={photo.id}>
          <PhotoThumbnail
            url={photo.url}
            onView={() => onPhotoSelect(photo.url)}
            onDelete={editable && onPhotoDelete ? () => onPhotoDelete(photo.id) : undefined}
            editable={editable}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}