'use client';

import { useRef } from 'react';
import { Button } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

interface PhotoUploadButtonProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function PhotoUploadButton({ onFileSelect, disabled = false }: PhotoUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      // Reset input value to allow selecting the same file again
      event.target.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <Button
        variant="contained"
        startIcon={<AddPhotoAlternateIcon />}
        onClick={handleClick}
        disabled={disabled}
        fullWidth
      >
        Select Photo
      </Button>
    </>
  );
}