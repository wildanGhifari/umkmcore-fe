// src/theme.js
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#673ab7', // A deep purple
    },
    secondary: {
      main: '#ffc107', // An amber color
    },
    background: {
      default: '#f4f5f7',
      paper: '#ffffff',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9575cd', // A lighter purple for dark mode
    },
    secondary: {
      main: '#ffca28', // A slightly lighter amber for dark mode
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

export { lightTheme, darkTheme };
