// src/theme.js
import { createTheme } from '@mui/material/styles';

// Full color scheme from Figma's Material Theme Builder
const figmaSchemes = {
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
        "inversePrimary": "#FFBB0C",
        "surfaceDim": "#E5D8C8",
        "surfaceBright": "#FFF8F3",
        "surfaceContainerLowest": "#FFFFFF",
        "surfaceContainerLow": "#FFF2E1",
        "surfaceContainer": "#F9ECDB",
        "surfaceContainerHigh": "#F3E6D6",
        "surfaceContainerHighest": "#EDE1D0"
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
        "inversePrimary": "#7B5800",
        "surfaceDim": "#181309",
        "surfaceBright": "#3F382D",
        "surfaceContainerLowest": "#120D05",
        "surfaceContainerLow": "#211B11",
        "surfaceContainer": "#251F14",
        "surfaceContainerHigh": "#30291E",
        "surfaceContainerHighest": "#3B3428"
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
