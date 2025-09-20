import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// --- 1. Color Palette ---
// As defined in DESIGN.md: A mix of brand, semantic, and data visualization colors.
const palette = {
  primary: {
    main: '#0052CC', // A strong, professional blue for primary actions and accents.
    light: '#4C8BFF',
    dark: '#003380',
  },
  secondary: {
    main: '#5E6C84', // A neutral secondary color for less prominent elements.
  },
  error: {
    main: '#DE350B', // Red for critical errors and alerts.
  },
  warning: {
    main: '#FFAB00', // Amber for warnings.
  },
  success: {
    main: '#36B37E', // Green for success states.
  },
  info: {
    main: '#00B8D9', // Cyan for informational messages.
  },
  background: {
    default: '#F4F5F7', // A very light grey for the main background.
    paper: '#FFFFFF',   // White for cards and surfaces.
  },
  text: {
    primary: '#172B4D',   // Dark, near-black for high-contrast text.
    secondary: '#5E6C84', // Grey for secondary text and labels.
  },
};

// --- 2. Typography ---
// As defined in DESIGN.md: Using a modern, readable sans-serif font.
// We'll use Roboto as it integrates seamlessly with MUI.
let theme = createTheme({
  palette: palette,
  typography: {
    fontFamily: ['"Roboto"', '"Helvetica"', '"Arial"', 'sans-serif'].join(','),
    h1: { fontSize: '2.5rem', fontWeight: 600 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    h4: { fontSize: '1.5rem', fontWeight: 600 },
    h5: { fontSize: '1.25rem', fontWeight: 600 },
    h6: { fontSize: '1.1rem', fontWeight: 600, color: palette.text.secondary }, // Sub-headers
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    caption: { fontSize: '0.75rem', color: palette.text.secondary },
  },
  // --- 3. Spacing & Shape ---
  spacing: 8, // Base spacing unit (8px)
  shape: {
    borderRadius: 12, // Softer, more modern rounded corners for cards and components.
  },
  // --- 4. Component Overrides ---
  // Enforcing the visual style for key components as per DESIGN.md.
  components: {
    // Card Design: Elevation, Rounded Corners, and consistent shadows.
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Ensure no gradient backgrounds from default MUI modes.
        },
        elevation1: {
          boxShadow: '0px 4px 12px rgba(23, 43, 77, 0.06)', // A subtle, clean shadow.
        },
        elevation2: {
          boxShadow: '0px 7px 14px rgba(23, 43, 77, 0.08)',
        },
      },
    },
    // Tooltip Design: Richer tooltips for charts and interactive elements.
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: palette.text.primary,
          color: palette.background.paper,
          fontSize: '0.875rem',
          padding: '8px 12px',
          borderRadius: 8,
        },
        arrow: {
          color: palette.text.primary,
        },
      },
    },
    // Button Design: Consistent look for primary actions.
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // More readable button text.
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: palette.primary.dark,
          },
        },
      },
    },
    // Sidebar Navigation: Active state clarity.
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 82, 204, 0.1)', // Subtle background for active item
            borderRight: `3px solid ${palette.primary.main}`,
            '&:hover': {
              backgroundColor: 'rgba(0, 82, 204, 0.15)',
            },
          },
        },
      },
    },
  },
});

// --- 5. Responsive Font Sizes ---
// Automatically adjust font sizes for different screen widths.
theme = responsiveFontSizes(theme);

export default theme;