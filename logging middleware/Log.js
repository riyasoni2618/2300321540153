const DEFAULT_LOGS_URL =
  process.env.LOGS_API_URL || 'http://4.224.186.213/evaluation-service/logs';

const VALID_LEVELS = new Set(['info', 'warn', 'error', 'debug']);

let authToken = null;

export function setAuthToken(token) {
  authToken = token ? formatBearer(token) : null;
}

export function getAuthToken() {
  return authToken;
}

export function Log(stack, level, packageName, message) {
  const normalisedLevel = level.toLowerCase();

  if (!VALID_LEVELS.has(normalisedLevel)) {
    throw new Error(`Invalid log level: ${level}`);
  }

  if (!stack || !packageName || !message) {
    throw new Error('Log requires stack, package, and message');
  }

  sendLogToServer({
    stack,
    level: normalisedLevel,
    package: packageName,
    message: String(message),
  });
}

function formatBearer(token) {
  const trimmed = token.trim();

  if (trimmed.toLowerCase().startsWith('bearer ')) {
    return trimmed;
  }

  return `Bearer ${trimmed}`;
}

function sendLogToServer(payload) {
  if (!authToken) {
    return;
  }

  fetch(DEFAULT_LOGS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authToken,
    },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Remote logging must not crash the application.
  });
}
