import { LOGS_URL } from '../config/constants';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

let authToken: string | null = null;

function formatBearer(token: string): string {
  const trimmed = token.trim();
  return trimmed.toLowerCase().startsWith('bearer ') ? trimmed : `Bearer ${trimmed}`;
}

export function setAuthToken(token: string): void {
  authToken = formatBearer(token);
}

export function Log(stack: string, level: LogLevel, pkg: string, message: string): void {
  if (!authToken) {
    return;
  }

  fetch(LOGS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authToken,
    },
    body: JSON.stringify({ stack, level, package: pkg, message }),
  }).catch(() => undefined);
}
