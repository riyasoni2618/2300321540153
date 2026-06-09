# Logging Middleware

Custom logging middleware from the Pre-Test Setup stage.

## Requirements

- `console.log`, `console.error`, and built-in loggers must not be used
- Every log is sent to the Test Server Log API
- Protected endpoint: `POST http://4.224.186.213/evaluation-service/logs`

## Log Signature

```js
Log(stack, level, package, message)
```

Example:

```js
Log('backend', 'info', 'service', 'Fetching notifications')
```

Supported levels (lowercase only): `info`, `warn`, `error`, `debug`

## Setup

Authenticate first, then initialise the logger with the bearer token:

```js
import logger, { setAuthToken, Log } from 'logging-middleware';

setAuthToken('Bearer <token>');

logger.info('Application started');
Log('backend', 'info', 'service', 'Fetching notifications');
```

## Environment Variables

| Variable | Description |
| -------- | ----------- |
| `LOGS_API_URL` | Log API endpoint (defaults to evaluation-service `/logs`) |
| `LOG_STACK` | Default stack name (defaults to `backend`) |
| `LOG_LEVEL` | Minimum level for the Logger wrapper (`info`, `debug`, etc.) |

Authorization for the Log API uses the same bearer token set via `setAuthToken()`.
