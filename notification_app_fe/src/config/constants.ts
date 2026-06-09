export const API_BASE = '/evaluation-service';

export const NOTIFICATIONS_URL = `${API_BASE}/notifications`;
export const LOGS_URL = `${API_BASE}/logs`;

export const NOTIFICATION_WEIGHTS: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export const RECENCY_MULTIPLIER = 1e13;

export const TOP_N_OPTIONS = [10, 15, 20] as const;

export const TYPE_OPTIONS = ['All', 'Placement', 'Result', 'Event'] as const;

export const TYPE_COLORS: Record<string, 'error' | 'warning' | 'info'> = {
  Placement: 'error',
  Result: 'warning',
  Event: 'info',
};
