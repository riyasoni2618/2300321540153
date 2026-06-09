export const DEFAULT_API_URL =
  'http://4.224.186.213/evaluation-service/notifications';

export const DEFAULT_AUTH_URL =
  'http://4.224.186.213/evaluation-service/auth';

export const DEFAULT_LOGS_URL =
  'http://4.224.186.213/evaluation-service/logs';

export const DEFAULT_TOP_N = 10;

export const NOTIFICATION_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export const RECENCY_MULTIPLIER = 1e13;

export function loadConfig(authToken) {
  const topN = parseInt(process.env.TOP_N ?? String(DEFAULT_TOP_N), 10);

  if (!Number.isInteger(topN) || topN <= 0) {
    throw new Error('TOP_N must be a positive integer');
  }

  if (!authToken) {
    throw new Error('Authorization token is required');
  }

  return {
    apiUrl: process.env.NOTIFICATION_API_URL || DEFAULT_API_URL,
    authToken,
    topN,
  };
}
