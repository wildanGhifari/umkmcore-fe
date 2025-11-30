// src/theme.js
import { createTheme } from '@mui/material/styles';

const figmaColors = {
    "light": {
        "primary": "#7B5800",
        "surfaceTint": "#7B5800",
        "onPrimary": "#FFFFFF",
        "primaryContainer": "#FFDEA6",
        "onPrimaryContainer": "#271900",
        "secondary": "#705B37",
        "onSecondary": "#FFFFFF",
        "secondaryContainer": "#FBDFB0",
        "onSecondaryContainer": "#564421",
        "tertiary": "#566500",
        "onTertiary": "#FFFFFF",
        "tertiaryContainer": "#D9EE5A",
        "onTertiaryContainer": "#181E00",
        "error": "#BA1A1A",
        "onError": "#FFFFFF",
        "errorContainer": "#FFDAD6",
        "onErrorContainer": "#410002",
        "background": "#FFF8F3",
        "onBackground": "#211B11",
        "surface": "#FFF8F3",
        "onSurface": "#211B11",
        "surfaceVariant": "#F2E0C6",
        "onSurfaceVariant": "#504532",
        "outline": "#837560",
        "outlineVariant": "#D5C4AB",
        "shadow": "#000000",
        "scrim": "#000000",
        "inverseSurface": "#362F24",
        "inverseOnSurface": "#FCEFDE",
        "inversePrimary": "#FFBB0C"
    },
    "dark": {
        "primary": "#FFBB0C",
        "surfaceTint": "#FFBB0C",
        "onPrimary": "#412D00",
        "primaryContainer": "#5D4200",
        "onPrimaryContainer": "#FFDEA6",
        "secondary": "#E7C17C",
        "onSecondary": "#412D00",
        "secondaryContainer": "#564421",
        "onSecondaryContainer": "#FBDFB0",
        "tertiary": "#BAD241",
        "onTertiary": "#2C3400",
        "tertiaryContainer": "#404C00",
        "onTertiaryContainer": "#D9EE5A",
        "error": "#FFB4AB",
        "onError": "#690005",
        "errorContainer": "#93000A",
        "onErrorContainer": "#FFDAD6",
        "background": "#181309",
        "onBackground": "#EDE1D0",
        "surface": "#181309",
        "onSurface": "#EDE1D0",
        "surfaceVariant": "#504532",
        "onSurfaceVariant": "#D5C4AB",
        "outline": "#9D8F78",
        "outlineVariant": "#504532",
        "shadow": "#000000",
        "scrim": "#000000",
        "inverseSurface": "#EDE1D0",
        "inverseOnSurface": "#362F24",
        "inversePrimary": "#7B5800"
    }
};

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: figmaColors.light.primary,
      contrastText: figmaColors.light.onPrimary,
    },
    secondary: {
      main: figmaColors.light.secondary,
      contrastText: figmaColors.light.onSecondary,
    },
    error: {
      main: figmaColors.light.error,
      contrastText: figmaColors.light.onError,
    },
    background: {
      default: figmaColors.light.background,
      paper: figmaColors.light.surface,
    },
    text: {
      primary: figmaColors.light.onSurface,
      secondary: figmaColors.light.onSurfaceVariant,
    },
    // You can add more mappings here if needed
    // For example, for container colors
    primaryContainer: {
      main: figmaColors.light.primaryContainer,
      contrastText: figmaColors.light.onPrimaryContainer,
    },
    secondaryContainer: {
      main: figmaColors.light.secondaryContainer,
      contrastText: figmaColors.light.onSecondaryContainer,
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: figmaColors.dark.primary,
      contrastText: figmaColors.dark.onPrimary,
    },
    secondary: {
      main: figmaColors.dark.secondary,
      contrastText: figmaColors.dark.onSecondary,
    },
    error: {
      main: figmaColors.dark.error,
      contrastText: figmaColors.dark.onError,
    },
    background: {
      default: figmaColors.dark.background,
      paper: figmaColors.dark.surface,
    },
    text: {
      primary: figmaColors.dark.onSurface,
      secondary: figmaColors.dark.onSurfaceVariant,
    },
    primaryContainer: {
      main: figmaColors.dark.primaryContainer,
      contrastText: figmaColors.dark.onPrimaryContainer,
    },
    secondaryContainer: {
      main: figmaColors.dark.secondaryContainer,
      contrastText: figmaColors.dark.onSecondaryContainer,
    },
  },
});

export { lightTheme, darkTheme };
