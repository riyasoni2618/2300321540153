import logger from 'logging-middleware';
import { NOTIFICATION_WEIGHTS, RECENCY_MULTIPLIER } from '../config/index.js';

const scoreLogger = logger.child('PriorityCalculator');

export function parseTimestamp(timestamp) {
  const parsed = new Date(timestamp.replace(' ', 'T'));

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid timestamp: ${timestamp}`);
  }

  return parsed.getTime();
}

export function calculatePriorityScore(notification) {
  const weight = NOTIFICATION_WEIGHTS[notification.Type];

  if (weight === undefined) {
    throw new Error(`Unknown notification type: ${notification.Type}`);
  }

  const timestampMs = parseTimestamp(notification.Timestamp);
  const score = weight * RECENCY_MULTIPLIER + timestampMs;

  scoreLogger.debug('Priority score calculated', {
    id: notification.ID,
    type: notification.Type,
    weight,
    timestamp: notification.Timestamp,
    score,
  });

  return score;
}
