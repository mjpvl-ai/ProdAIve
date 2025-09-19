import { createTheme } from '@mui/material/styles';

// --- COLOR PALETTE ---
const palette = {
  primary: {
    main: '#1A237E', // A deep, sophisticated blue
    light: '#534bae',
    dark: '#000051',
  },
  secondary: {
    main: '#00ACC1', // A vibrant, energetic teal
    light: '#5ddef4',
    dark: '#007c91',
  },
  background: {
    default: '#F4F6F8', // A very light, clean grey
    paper: '#FFFFFF',
  },
  text: {
    primary: '#212121', // Dark grey for high contrast and readability
    secondary: '#616161', // Lighter grey for secondary text
  },
  success: {
    main: '#4CAF50', // Green
  },
  warning: {
    main: '#FFC107', // Yellow
  },
  error: {
    main: '#F44336', // Red
  },
  info: {
    main: '#2196F3', // Blue
    light: '#BBDEFB', // Light Blue
    dark: '#1976D2', // Dark Blue
  },
};

// --- TYPOGRAPHY ---
const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 700,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  h6: {
    fontSize: '1.1rem',
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
  },
  button: {
    textTransform: 'none' as any, // For a more modern, less "shouty" UI
    fontWeight: 600,
  },
};

// --- SPACING & BORDER RADIUS ---
const spacing = 8; // Base spacing unit
const shape = {
  borderRadius: 8, // Slightly larger radius for a softer, more modern look
};

// --- COMPONENT OVERRIDES ---
const components = {
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: palette.primary.dark,
        color: '#FFFFFF',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: palette.background.paper,
        color: palette.text.primary,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        borderBottom: `1px solid ${palette.background.default}`,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: shape.borderRadius,
      },
      containedPrimary: {
        color: '#FFFFFF',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: shape.borderRadius * 1.5,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        color: 'inherit',
        minWidth: '40px',
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        margin: '4px 8px',
        borderRadius: shape.borderRadius,
        '&.Mui-selected': {
          backgroundColor: palette.primary.main,
          '&:hover': {
            backgroundColor: palette.primary.light,
          },
        },
        '&:hover': {
          backgroundColor: palette.primary.dark,
        },
      },
    },
  },
};

// --- CREATE THEME ---
export const theme = createTheme({
  palette,
  typography,
  spacing,
  shape,
  components,
});