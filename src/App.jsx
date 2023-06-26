import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import { useState } from 'react';
//import './App.css'
import MainTreeView from './MainTreeView';
import ItemDialog from './ItemDialog';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
//import Grid from '@mui/material/Grid'; // Grid version 1
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Typography from '@mui/material/Typography';
import PostAddIcon from '@mui/icons-material/PostAdd';

export default function App() {
  const [nFontSize, setFontSize] = useState(12);

  let theme = createTheme({
    typography: {
      fontSize: nFontSize * 2,
    },
  });
  theme = responsiveFontSizes(theme);
  
    return (
      <ThemeProvider theme={theme}>
        <CaptionMain setFontSize={setFontSize} />
        <MainTreeView />
      </ThemeProvider>
    )
  }

  const CaptionMain = ({setFontSize}) => {
    //const fSetFontSize = props.setFontSize;
  const fTextIncrease = () => setFontSize(prev => ++prev);
  const fTextDecrease = () => setFontSize(prev => --prev);
  const fItemAdd = () => {}
  
  return <Grid container spacing={2} alignItems="center">
    <Grid xs>
      <Typography variant="h5" m={2}>ОрГМУ</Typography>
    </Grid>
    <Grid xs="auto" p={0}>
      <IconButton
        aria-label="+"
        size="small"
        onClick={fTextIncrease}
      >
        <TextIncreaseIcon fontSize="inherit" />
      </IconButton>
    </Grid>
    <Grid xs="auto">
      <IconButton
        aria-label="-"
        size="small"
        onClick={fTextDecrease}
      >
        <TextDecreaseIcon fontSize="inherit" />
      </IconButton>
    </Grid>
    <Grid xs="auto">
      <IconButton
        aria-label="+"
        id='ItemAddRoot'
      >
        <PostAddIcon />
      </IconButton>
    </Grid>
  </Grid>
}
