'use client';

import { Stepper, Step, StepLabel } from '@mui/material';

interface EditLocationStepperProps {
  activeStep: number;
}

export default function EditLocationStepper({ activeStep }: EditLocationStepperProps) {
  const steps = [
    'Basic Info',
    'Accessibility',
    'Entrance',
    'Interior',
    'Review',
  ];

  return (
    <Stepper 
      activeStep={activeStep} 
      alternativeLabel
      sx={{
        p: 3,
        '& .MuiStepLabel-label': {
          mt: 1,
          color: 'text.secondary',
          '&.Mui-active': {
            color: 'primary.main',
            fontWeight: 'bold',
          },
        },
      }}
    >
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}