'use client';

import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196F3', // Higher contrast blue
      light: '#64B5F6', // Accessible lighter shade
      dark: '#1976D2', // Accessible darker shade
      contrastText: '#FFFFFF', // Improved readability
    },
    secondary: {
      main: '#494c7d', // Higher contrast purple
      light: '#D05CE3', // Accessible lighter shade
      dark: '#7B1FA2', // Accessible darker shade
      contrastText: '#FFFFFF', // Improved readability
    },
    error: {
      main: '#E53935',
      light: '#FF6F60',
      dark: '#AB000D',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#43A047',
      light: '#76D275',
      dark: '#00701A',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FB8C00',
      light: '#FFB74D',
      dark: '#C25E00',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          backgroundColor: '#2196F3',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#1976D2',
          },
        },
        outlined: {
          borderColor: '#2196F3',
          color: '#2196F3',
          '&:hover': {
            borderColor: '#1976D2',
            backgroundColor: 'rgba(33, 150, 243, 0.08)',
          },
        },
        text: {
          color: '#2196F3',
          '&:hover': {
            backgroundColor: 'rgba(33, 150, 243, 0.08)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(33, 150, 243, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1E1E1E',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1E1E1E',
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}