'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  onRemove?: (value: string) => void;
  className?: string;
}

export function ImageUpload({
  value = [],
  onChange,
  onRemove,
  className,
}: ImageUploadProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        
        if (data.url && onChange) {
          onChange([...value, data.url]);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    },
    [value, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxFiles: 1,
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors',
          isDragActive && 'border-primary bg-primary/5'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Drag & drop an image here, or click to select
        </p>
      </div>
      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {value.map((url) => (
            <div key={url} className="group relative aspect-square">
              <img
                src={url}
                alt="Upload"
                className="h-full w-full rounded-lg object-cover"
              />
              {onRemove && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute right-2 top-2 h-6 w-6 opacity-0 transition group-hover:opacity-100"
                  onClick={() => onRemove(url)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}