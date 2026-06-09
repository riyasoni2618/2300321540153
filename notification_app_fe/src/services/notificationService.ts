import { NOTIFICATIONS_URL } from '../config/constants';
import type { Notification, NotificationType } from '../types/notification';
import { Log } from './logService';

interface FetchOptions {
  limit?: number;
  page?: number;
  notificationType?: NotificationType;
}

function normalizeResponse(data: unknown): Notification[] {
  if (Array.isArray(data)) {
    return data as Notification[];
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;

    if (Array.isArray(record.notifications)) {
      return record.notifications as Notification[];
    }

    if (Array.isArray(record.data)) {
      return record.data as Notification[];
    }
  }

  throw new Error('Unexpected API response format');
}

function buildUrl({ limit, page, notificationType }: FetchOptions): string {
  const url = new URL(NOTIFICATIONS_URL, window.location.origin);

  if (limit !== undefined) {
    url.searchParams.set('limit', String(limit));
  }

  if (page !== undefined) {
    url.searchParams.set('page', String(page));
  }

  if (notificationType) {
    url.searchParams.set('notification_type', notificationType);
  }

  return url.toString();
}

export async function fetchNotifications(
  options: FetchOptions,
  authToken: string
): Promise<Notification[]> {
  const requestUrl = buildUrl(options);

  Log('frontend', 'info', 'service', `API fetch started: ${requestUrl}`);

  const response = await fetch(requestUrl, {
    headers: {
      Accept: 'application/json',
      Authorization: authToken,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    Log('frontend', 'error', 'service', `API fetch failed: ${response.status} ${body}`);
    throw new Error(`API request failed (${response.status}): ${body}`);
  }

  const data = await response.json();
  const notifications = normalizeResponse(data);

  Log('frontend', 'info', 'service', `API fetch succeeded: ${notifications.length} items`);

  return notifications;
}

export async function fetchAllNotifications(
  authToken: string,
  notificationType?: NotificationType
): Promise<Notification[]> {
  const limit = 10;
  const notifications: Notification[] = [];
  let page = 1;

  Log('frontend', 'info', 'service', 'Fetching all notification pages');

  while (true) {
    const batch = await fetchNotifications({ limit, page, notificationType }, authToken);

    if (batch.length === 0) {
      break;
    }

    notifications.push(...batch);

    if (batch.length < limit) {
      break;
    }

    page += 1;
  }

  Log('frontend', 'info', 'service', `Fetched ${notifications.length} notifications`);

  return notifications;
}
