// src/theme.js
import { createTheme } from '@mui/material/styles';

const figmaSchemes = {
    "light": {
        "primary": "#4F5B92",
        "surfaceTint": "#4F5B92",
        "onPrimary": "#FFFFFF",
        "primaryContainer": "#DDE1FF",
        "onPrimaryContainer": "#07164B",
        "secondary": "#5A5D72",
        "onSecondary": "#FFFFFF",
        "secondaryContainer": "#DFE1F9",
        "onSecondaryContainer": "#171B2C",
        "tertiary": "#76546E",
        "onTertiary": "#FFFFFF",
        "tertiaryContainer": "#FFD7F3",
        "onTertiaryContainer": "#2C1229",
        "error": "#BA1A1A",
        "onError": "#FFFFFF",
        "errorContainer": "#FFDAD6",
        "onErrorContainer": "#410002",
        "background": "#FBF8FF",
        "onBackground": "#1B1B21",
        "surface": "#FBF8FF",
        "onSurface": "#1B1B21",
        "surfaceVariant": "#E2E1EC",
        "onSurfaceVariant": "#45464F",
        "outline": "#767680",
        "outlineVariant": "#C6C5D0",
        "shadow": "#000000",
        "scrim": "#000000",
        "inverseSurface": "#2F3036",
        "inverseOnSurface": "#F2F0F7",
        "inversePrimary": "#B8C4FF",
        "surfaceDim": "#DBD9E0",
        "surfaceBright": "#FBF8FF",
        "surfaceContainerLowest": "#FFFFFF",
        "surfaceContainerLow": "#F5F2FA",
        "surfaceContainer": "#EFEDF4",
        "surfaceContainerHigh": "#E9E7EF",
        "surfaceContainerHighest": "#E3E1E9"
    },
    "dark": {
        "primary": "#B8C4FF",
        "surfaceTint": "#B8C4FF",
        "onPrimary": "#202C61",
        "primaryContainer": "#374379",
        "onPrimaryContainer": "#DDE1FF",
        "secondary": "#C2C5DD",
        "onSecondary": "#2C2F42",
        "secondaryContainer": "#424659",
        "onSecondaryContainer": "#DFE1F9",
        "tertiary": "#E4BAD9",
        "onTertiary": "#44273F",
        "tertiaryContainer": "#5C3D56",
        "onTertiaryContainer": "#FFD7F3",
        "error": "#FFB4AB",
        "onError": "#690005",
        "errorContainer": "#93000A",
        "onErrorContainer": "#FFDAD6",
        "background": "#121318",
        "onBackground": "#E3E1E9",
        "surface": "#121318",
        "onSurface": "#E3E1E9",
        "surfaceVariant": "#45464F",
        "onSurfaceVariant": "#C6C5D0",
        "outline": "#90909A",
        "outlineVariant": "#45464F",
        "shadow": "#000000",
        "scrim": "#000000",
        "inverseSurface": "#E3E1E9",
        "inverseOnSurface": "#2F3036",
        "inversePrimary": "#4F5B92",
        "surfaceDim": "#121318",
        "surfaceBright": "#38393F",
        "surfaceContainerLowest": "#0D0E13",
        "surfaceContainerLow": "#1B1B21",
        "surfaceContainer": "#1F1F25",
        "surfaceContainerHigh": "#292A2F",
        "surfaceContainerHighest": "#34343A"
    }
};

const createCustomTheme = (scheme) => createTheme({
  palette: {
    mode: scheme === 'light' ? 'light' : 'dark',
    primary: {
      main: figmaSchemes[scheme].primary,
      contrastText: figmaSchemes[scheme].onPrimary,
    },
    secondary: {
      main: figmaSchemes[scheme].secondary,
      contrastText: figmaSchemes[scheme].onSecondary,
    },
    error: {
      main: figmaSchemes[scheme].error,
      contrastText: figmaSchemes[scheme].onError,
    },
    background: {
      default: figmaSchemes[scheme].surfaceContainerLow,
      paper: figmaSchemes[scheme].surface,
    },
    text: {
      primary: figmaSchemes[scheme].onSurface,
      secondary: figmaSchemes[scheme].onSurfaceVariant,
    },
    primaryContainer: {
      main: figmaSchemes[scheme].primaryContainer,
      contrastText: figmaSchemes[scheme].onPrimaryContainer,
    },
    secondaryContainer: {
      main: figmaSchemes[scheme].secondaryContainer,
      contrastText: figmaSchemes[scheme].onSecondaryContainer,
    },
    surface: figmaSchemes[scheme],
  },
  components: {
    MuiList: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '999px',
          paddingLeft: '12px',
          paddingRight: '12px',
        }
      }
    }
  }
});

const lightTheme = createCustomTheme('light');
const darkTheme = createCustomTheme('dark');

export { lightTheme, darkTheme };
