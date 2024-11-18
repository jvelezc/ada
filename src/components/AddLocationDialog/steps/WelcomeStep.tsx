'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import StepContainer from '../StepContainer';
import ButtonContainer from '../ButtonContainer';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  const theme = useTheme();

  return (
    <StepContainer>
      {/* Hero Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 200,
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'primary.dark',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src="/images/accessibility/hero.jpg"
          alt="Accessible entrance"
          fill
          style={{ objectFit: 'cover', opacity: 0.7 }}
        />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Typography
            variant="h4"
            component="h2"
            align="center"
            sx={{ 
              color: 'white', 
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              px: 2,
            }}
          >
            Hi there! 👋
          </Typography>
        </motion.div>
      </Box>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Let's make the world more accessible together. 🌍✨
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          We'll add details about an accessible place step by step.
        </Typography>
      </motion.div>

      <ButtonContainer 
        onNext={onNext}
        nextLabel="Let's Begin! 👉"
      />
    </StepContainer>
  );
}