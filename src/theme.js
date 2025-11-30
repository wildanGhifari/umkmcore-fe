// src/theme.js
import { createTheme } from '@mui/material/styles';

// Full color scheme from Figma's Material Theme Builder
const figmaSchemes = {
    "light": {
        "primary": "#4F5B92",
        "surfaceTint": "#4F5B92",
        "onPrimary": "#FFFFFF",
        "primaryContainer": "#DDE1FF",
        "onPrimaryContainer": "#374379",
        "secondary": "#5A5D72",
        "onSecondary": "#FFFFFF",
        "secondaryContainer": "#DFE1F9",
        "onSecondaryContainer": "#424659",
        "tertiary": "#76546E",
        "onTertiary": "#FFFFFF",
        "tertiaryContainer": "#FFD7F3",
        "onTertiaryContainer": "#5C3D56",
        "error": "#BA1A1A",
        "onError": "#FFFFFF",
        "errorContainer": "#FFDAD6",
        "onErrorContainer": "#93000A",
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

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: figmaSchemes.light.primary,
      contrastText: figmaSchemes.light.onPrimary,
    },
    secondary: {
      main: figmaSchemes.light.secondary,
      contrastText: figmaSchemes.light.onSecondary,
    },
    error: {
      main: figmaSchemes.light.error,
      contrastText: figmaSchemes.light.onError,
    },
    background: {
      default: figmaSchemes.light.surfaceContainerLowest, // Updated for body background
      paper: figmaSchemes.light.surfaceBright, // Updated for NavRail background
    },
    text: {
      primary: figmaSchemes.light.onSurface,
      secondary: figmaSchemes.light.onSurfaceVariant,
    },
    // Custom container colors
    primaryContainer: {
      main: figmaSchemes.light.primaryContainer,
      contrastText: figmaSchemes.light.onPrimaryContainer,
    },
    secondaryContainer: {
      main: figmaSchemes.light.secondaryContainer,
      contrastText: figmaSchemes.light.onSecondaryContainer,
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: figmaSchemes.dark.primary,
      contrastText: figmaSchemes.dark.onPrimary,
    },
    secondary: {
      main: figmaSchemes.dark.secondary,
      contrastText: figmaSchemes.dark.onSecondary,
    },
    error: {
      main: figmaSchemes.dark.error,
      contrastText: figmaSchemes.dark.onError,
    },
    background: {
      default: figmaSchemes.dark.surfaceContainerLowest, // Updated for body background
      paper: figmaSchemes.dark.surfaceBright, // Updated for NavRail background
    },
    text: {
      primary: figmaSchemes.dark.onSurface,
      secondary: figmaSchemes.dark.onSurfaceVariant,
    },
    // Custom container colors
    primaryContainer: {
      main: figmaSchemes.dark.primaryContainer,
      contrastText: figmaSchemes.dark.onPrimaryContainer,
    },
    secondaryContainer: {
      main: figmaSchemes.dark.secondaryContainer,
      contrastText: figmaSchemes.dark.onSecondaryContainer,
    },
  },
});

export { lightTheme, darkTheme };
