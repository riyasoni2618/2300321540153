import { NOTIFICATION_WEIGHTS, RECENCY_MULTIPLIER } from '../config/constants';
import type { Notification } from '../types/notification';

export function parseTimestamp(timestamp: string): number {
  const parsed = new Date(timestamp.replace(' ', 'T'));

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid timestamp: ${timestamp}`);
  }

  return parsed.getTime();
}

export function calculatePriorityScore(notification: Notification): number {
  const weight = NOTIFICATION_WEIGHTS[notification.Type];

  if (weight === undefined) {
    throw new Error(`Unknown notification type: ${notification.Type}`);
  }

  return weight * RECENCY_MULTIPLIER + parseTimestamp(notification.Timestamp);
}
