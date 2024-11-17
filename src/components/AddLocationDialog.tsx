'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { accessibilityConfig } from './Map';
import { ImageUpload } from './ImageUpload';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const locationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  description: z.string().optional(),
  accessibility: z.enum(['full', 'partial', 'none', 'unknown']),
  images: z.array(z.string()).optional(),
  lat: z.number(),
  lng: z.number(),
});

type LocationFormData = z.infer<typeof locationSchema>;

interface AddLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLocation?: { lat: number; lng: number };
}

export default function AddLocationDialog({ 
  open, 
  onOpenChange,
  currentLocation 
}: AddLocationDialogProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      accessibility: 'unknown',
      images: [],
      lat: currentLocation?.lat,
      lng: currentLocation?.lng,
    },
  });

  const onSubmit = async (data: LocationFormData) => {
    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, images }),
      });

      if (!response.ok) {
        throw new Error('Failed to add location');
      }

      toast({
        title: 'Success',
        description: 'Location added successfully',
      });

      reset();
      setImages([]);
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add location. Please try again.',
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto sm:h-screen">
        <SheetHeader>
          <SheetTitle>Add New Location</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Location Name</Label>
            <Input
              id="name"
              placeholder="Enter location name"
              {...register('name')}
              className={cn(errors.name && 'border-red-500')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Enter address"
              {...register('address')}
              className={cn(errors.address && 'border-red-500')}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the accessibility features..."
              className="resize-none"
              {...register('description')}
            />
          </div>

          <div className="space-y-2">
            <Label>Accessibility Status</Label>
            <RadioGroup
              onValueChange={(value) => setValue('accessibility', value as LocationFormData['accessibility'])}
              defaultValue="unknown"
              className="grid gap-2"
            >
              {Object.entries(accessibilityConfig).map(([key, config]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={key} />
                  <Label htmlFor={key} className="flex items-center gap-2">
                    <div className={cn(
                      'rounded-full p-0.5 border',
                      config.bgColor,
                      config.borderColor
                    )}>
                      <MapPin className={cn('h-4 w-4', config.color)} />
                    </div>
                    <div>
                      <span className="text-sm font-medium">{config.label}</span>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Photos</Label>
            <ImageUpload
              value={images}
              onChange={setImages}
              onRemove={(url) => setImages(images.filter((i) => i !== url))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Location'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}