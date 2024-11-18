'use client';

import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90CAF9',
      light: '#BBE2FF',
      dark: '#5D99C6',
      contrastText: '#000000',
    },
    secondary: {
      main: '#CE93D8',
      light: '#F3E5F5',
      dark: '#AB47BC',
      contrastText: '#000000',
    },
    error: {
      main: '#EF5350',
      light: '#FF867C',
      dark: '#B61827',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#66BB6A',
      light: '#98EE99',
      dark: '#338A3E',
      contrastText: '#000000',
    },
    warning: {
      main: '#FFA726',
      light: '#FFD95B',
      dark: '#C77800',
      contrastText: '#000000',
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
          backgroundColor: '#90CAF9',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#5D99C6',
          },
        },
        outlined: {
          borderColor: '#90CAF9',
          color: '#90CAF9',
          '&:hover': {
            borderColor: '#5D99C6',
            backgroundColor: 'rgba(144, 202, 249, 0.08)',
          },
        },
        text: {
          color: '#90CAF9',
          '&:hover': {
            backgroundColor: 'rgba(144, 202, 249, 0.08)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(144, 202, 249, 0.08)',
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