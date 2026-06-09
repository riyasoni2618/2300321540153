import { AppBar, Box, CssBaseline, Toolbar, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { PriorityInboxView } from './components/PriorityInboxView';
import { theme } from './theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" fontWeight={600}>
              AffordMed — Notification System
            </Typography>
          </Toolbar>
        </AppBar>

        <PriorityInboxView />
      </Box>
    </ThemeProvider>
  );
}
