'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Card,
  CardContent,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import { LocationFormData } from '@/types';
import { addLocation } from '@/lib/supabase';
import StepperProgress from '@/components/AddLocationDialog/StepperProgress';
import WelcomeStep from '@/components/AddLocationDialog/steps/WelcomeStep';
import BasicInfoStep from '@/components/AddLocationDialog/steps/BasicInfoStep';
import AccessibilityLevelStep from '@/components/AddLocationDialog/steps/AccessibilityLevelStep';
import EntranceStep from '@/components/AddLocationDialog/steps/EntranceStep';
import DoorwayStep from '@/components/AddLocationDialog/steps/DoorwayStep';
import InteriorStep from '@/components/AddLocationDialog/steps/InteriorStep';
import ParkingStep from '@/components/AddLocationDialog/steps/ParkingStep';
import RestroomStep from '@/components/AddLocationDialog/steps/RestroomStep';
import DogFriendlyStep from '@/components/AddLocationDialog/steps/DogFriendlyStep';
import PhotosStep from '@/components/AddLocationDialog/steps/PhotosStep';
import SummaryStep from '@/components/AddLocationDialog/steps/SummaryStep';

const steps = [
  { label: 'Welcome' },
  { label: 'Basic Info' },
  { label: 'Accessibility' },
  { label: 'Entrance' },
  { label: 'Doorway' },
  { label: 'Interior' },
  { label: 'Parking' },
  { label: 'Restroom' },
  { label: 'Dog Friendly' },
  { label: 'Photos' },
  { label: 'Review' },
];

export default function AddLocationPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<LocationFormData>>({});
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  const handleBack = () => {
    if (step === 0) {
      setExitDialogOpen(true);
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleNext = (data: Partial<LocationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    try {
      await addLocation(formData as LocationFormData);
      router.push('/');
    } catch (error) {
      console.error('Error submitting location:', error);
    }
  };

  const handleExit = () => {
    router.push('/');
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      {/* Close Button Bar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bgcolor: 'error.main',
          color: 'error.contrastText',
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          boxShadow: 2,
        }}
      >
        <Typography variant="subtitle1">
          Adding New Location
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => setExitDialogOpen(true)}
          startIcon={<CloseIcon />}
          sx={{
            bgcolor: 'error.dark',
            '&:hover': {
              bgcolor: 'error.dark',
              opacity: 0.9,
            },
          }}
        >
          Exit
        </Button>
      </Box>

      <Container 
        maxWidth={false}
        sx={{ 
          flex: 1,
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 4, md: 6, lg: 8 },
          display: 'flex',
          flexDirection: 'column',
          mt: 7, // Add margin top to account for the close button bar
        }}
      >
        <Card 
          elevation={4}
          sx={{ 
            position: 'relative',
            flex: 1,
            bgcolor: 'background.paper',
            borderRadius: 2,
            overflow: 'visible',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ 
            position: 'absolute', 
            top: 8, 
            left: 8,
            zIndex: 10 
          }}>
            <Tooltip title="Go back" placement="right">
              <IconButton 
                onClick={handleBack}
                sx={{ 
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: (theme) => `${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <CardContent 
            sx={{ 
              p: 0, 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              '&:last-child': { pb: 0 },
            }}
          >
            <StepperProgress steps={steps} currentStep={step} />

            <Box 
              sx={{ 
                px: { xs: 2, sm: 3, md: 4 },
                pb: { xs: 2, sm: 3 },
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                >
                  <Box sx={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '100%',
                    margin: '0 auto',
                    width: '100%',
                  }}>
                    {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}
                    {step === 1 && <BasicInfoStep onNext={handleNext} onBack={handleBack} />}
                    {step === 2 && <AccessibilityLevelStep onNext={handleNext} onBack={handleBack} />}
                    {step === 3 && <EntranceStep onNext={handleNext} onBack={handleBack} />}
                    {step === 4 && <DoorwayStep onNext={handleNext} onBack={handleBack} />}
                    {step === 5 && <InteriorStep onNext={handleNext} onBack={handleBack} />}
                    {step === 6 && <ParkingStep onNext={handleNext} onBack={handleBack} />}
                    {step === 7 && <RestroomStep onNext={handleNext} onBack={handleBack} />}
                    {step === 8 && <DogFriendlyStep onNext={handleNext} onBack={handleBack} />}
                    {step === 9 && <PhotosStep onNext={handleNext} onBack={handleBack} />}
                    {step === 10 && (
                      <SummaryStep
                        data={formData}
                        onBack={handleBack}
                        onSubmit={handleSubmit}
                      />
                    )}
                  </Box>
                </motion.div>
              </AnimatePresence>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Dialog
        open={exitDialogOpen}
        onClose={() => setExitDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>Exit Location Wizard?</DialogTitle>
        <DialogContent>
          Are you sure you want to exit? All your progress will be lost.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExitDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExit} color="error">
            Exit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}