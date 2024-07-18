import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f0bfcf',
      paper: '#f0bfcf',
    },
    primary: {
      main: '#f48fb1',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    primary: {
      main: '#f48fb1',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

export { lightTheme, darkTheme };
