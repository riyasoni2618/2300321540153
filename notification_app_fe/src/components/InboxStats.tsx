import { Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import type { InboxResult } from '../types/notification';

interface InboxStatsProps {
  result: InboxResult;
}

export function InboxStats({ result }: InboxStatsProps) {
  const items = [
    { label: 'Processed', value: result.processedCount },
    { label: 'Heap Size', value: result.heapSize },
    { label: 'Top N', value: result.topN },
    { label: 'Displayed', value: result.notifications.length },
  ];

  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid key={item.label} size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {item.label}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {item.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
