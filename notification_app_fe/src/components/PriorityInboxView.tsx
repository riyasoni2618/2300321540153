import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useState } from 'react';
import type { InboxResult } from '../types/notification';
import { fetchAllNotifications } from '../services/notificationService';
import { buildPriorityInbox } from '../services/priorityInbox';
import { Log, setAuthToken } from '../services/logService';
import { FilterBar, resolveTypeFilter } from './FilterBar';
import { InboxStats } from './InboxStats';
import { NotificationCard } from './NotificationCard';

function getAuthToken(): string {
  const token = import.meta.env.VITE_API_AUTHORIZATION?.trim();

  if (!token) {
    throw new Error('VITE_API_AUTHORIZATION is not set in .env');
  }

  return token.toLowerCase().startsWith('bearer ') ? token : `Bearer ${token}`;
}

export function PriorityInboxView() {
  const [topN, setTopN] = useState(10);
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InboxResult | null>(null);

  const loadInbox = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const authToken = getAuthToken();
      setAuthToken(authToken);

      Log('frontend', 'info', 'application', 'Loading priority inbox');

      const notifications = await fetchAllNotifications(
        authToken,
        resolveTypeFilter(typeFilter)
      );

      const inbox = buildPriorityInbox(notifications, topN);
      setResult(inbox);

      Log('frontend', 'info', 'application', 'Priority inbox rendered');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load inbox';
      setError(message);
      Log('frontend', 'error', 'application', message);
    } finally {
      setLoading(false);
    }
  }, [topN, typeFilter]);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Campus Priority Inbox
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Top priority unread notifications ranked by type and recency.
          </Typography>
        </Box>

        <FilterBar
          topN={topN}
          typeFilter={typeFilter}
          loading={loading}
          onTopNChange={setTopN}
          onTypeChange={setTypeFilter}
          onRefresh={loadInbox}
        />

        {error && <Alert severity="error">{error}</Alert>}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && result && (
          <Stack spacing={3}>
            <InboxStats result={result} />

            <Divider />

            <Typography variant="h6" fontWeight={600}>
              Priority Inbox (Top {result.topN})
            </Typography>

            {result.notifications.length === 0 ? (
              <Alert severity="info">No notifications to display.</Alert>
            ) : (
              <Grid container spacing={2}>
                {result.notifications.map((notification, index) => (
                  <Grid key={notification.ID} size={{ xs: 12, sm: 6, md: 4 }}>
                    <NotificationCard notification={notification} rank={index + 1} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
