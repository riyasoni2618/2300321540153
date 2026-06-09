import logger from 'logging-middleware';

const apiLogger = logger.child('NotificationService');

function normalizeResponse(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.notifications)) {
    return data.notifications;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  throw new Error('Unexpected API response format');
}

function buildRequestUrl(baseUrl, { limit, page, notificationType }) {
  const url = new URL(baseUrl);

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

function buildHeaders(authToken) {
  if (!authToken) {
    throw new Error('Authorization token is required');
  }

  return {
    Accept: 'application/json',
    Authorization: authToken,
  };
}

export async function fetchNotifications(
  { limit, page, notificationType } = {},
  { apiUrl, authToken } = {}
) {
  const baseUrl = apiUrl || process.env.NOTIFICATION_API_URL;

  if (!baseUrl) {
    throw new Error('NOTIFICATION_API_URL is not configured');
  }

  if (!authToken) {
    throw new Error('Authorization token is required');
  }

  const requestUrl = buildRequestUrl(baseUrl, { limit, page, notificationType });

  apiLogger.info('API fetch started', { url: requestUrl });

  try {
    const response = await fetch(requestUrl, {
      headers: buildHeaders(authToken),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      const error = new Error(
        `API request failed (${response.status} ${response.statusText})${body ? `: ${body}` : ''}`
      );

      apiLogger.error('API fetch failed', {
        url: requestUrl,
        status: response.status,
        body,
      });

      throw error;
    }

    const data = await response.json();
    const notifications = normalizeResponse(data);

    apiLogger.info('API fetch succeeded', {
      url: requestUrl,
      count: notifications.length,
    });

    return notifications;
  } catch (error) {
    if (!error.message.startsWith('API request failed')) {
      apiLogger.error('API fetch failed', {
        url: requestUrl,
        reason: error.message,
      });
    }

    throw error;
  }
}

export async function fetchAllNotifications(
  { limit = 10, notificationType } = {},
  config = {}
) {
  const notifications = [];
  let page = 1;

  apiLogger.info('Fetching all notification pages', { limit, notificationType });

  while (true) {
    const batch = await fetchNotifications({ limit, page, notificationType }, config);

    if (batch.length === 0) {
      break;
    }

    notifications.push(...batch);

    if (batch.length < limit) {
      break;
    }

    page += 1;
  }

  apiLogger.info('All notification pages fetched', {
    total: notifications.length,
    pages: page,
  });

  return notifications;
}
