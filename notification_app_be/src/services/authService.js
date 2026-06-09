const DEFAULT_AUTH_URL =
  process.env.AUTH_API_URL || 'http://4.224.186.213/evaluation-service/auth';

function sanitizeToken(token) {
  return token.trim().replace(/^['"]|['"]$/g, '').replace(/\s+/g, '');
}

function formatBearer(token) {
  const trimmed = sanitizeToken(token);

  if (trimmed.toLowerCase().startsWith('bearer')) {
    return trimmed.toLowerCase().startsWith('bearer ')
      ? trimmed
      : `Bearer ${trimmed.slice(6).trim()}`;
  }

  return `Bearer ${trimmed}`;
}

function extractToken(data) {
  const token =
    data?.token ||
    data?.accessToken ||
    data?.access_token ||
    data?.authorization;

  if (!token) {
    throw new Error('Auth response did not include a token');
  }

  return formatBearer(token);
}

export async function obtainAuthToken() {
  const configuredAuth = process.env.API_AUTHORIZATION?.trim();

  if (configuredAuth) {
    return formatBearer(configuredAuth);
  }

  const clientId = process.env.CLIENT_ID?.trim();
  const clientSecret = process.env.CLIENT_SECRET?.trim();
  const accessCode = process.env.ACCESS_TOKEN?.trim();
  const email = process.env.EMAIL?.trim();
  const name = process.env.NAME?.trim();
  const rollNo = process.env.ROLL_NO?.trim();

  const missing = [];

  if (!email) missing.push('EMAIL');
  if (!name) missing.push('NAME');
  if (!rollNo) missing.push('ROLL_NO');
  if (!accessCode) missing.push('ACCESS_TOKEN');
  if (!clientId) missing.push('CLIENT_ID');
  if (!clientSecret) missing.push('CLIENT_SECRET');

  if (missing.length > 0) {
    throw new Error(
      `Missing auth configuration. Set API_AUTHORIZATION or provide: ${missing.join(', ')}`
    );
  }

  const response = await fetch(DEFAULT_AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      name,
      rollNo,
      accessCode,
      clientID: clientId,
      clientSecret,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      `Authentication failed (${response.status}): ${JSON.stringify(data)}`
    );
  }

  return extractToken(data);
}
