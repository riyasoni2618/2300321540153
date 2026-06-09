import 'dotenv/config';
import logger, { setAuthToken } from 'logging-middleware';
import { loadConfig } from './config/index.js';
import { obtainAuthToken } from './services/authService.js';
import { fetchAllNotifications } from './services/notificationService.js';
import { PriorityInbox } from './services/priorityInbox.js';
import { printPriorityInbox } from './utils/outputFormatter.js';

const appLogger = logger.child('Application');

async function main() {
  try {
    const authToken = await obtainAuthToken();
    setAuthToken(authToken);

    appLogger.info('Application startup');

    const config = loadConfig(authToken);
    const inbox = new PriorityInbox(config.topN);

    appLogger.info('Fetching notifications from API', {
      apiUrl: config.apiUrl,
      topN: config.topN,
    });

    const notifications = await fetchAllNotifications(
      { limit: 10 },
      {
        apiUrl: config.apiUrl,
        authToken: config.authToken,
      }
    );

    appLogger.info('Processing notifications into priority inbox', {
      received: notifications.length,
    });

    for (const notification of notifications) {
      inbox.add(notification);
    }

    printPriorityInbox({
      topN: config.topN,
      processedCount: inbox.getProcessedCount(),
      heapSize: inbox.getHeapSize(),
      notifications: inbox.getTopNotifications(),
    });

    appLogger.info('Application completed successfully');
  } catch (error) {
    const fallbackToken = process.env.API_AUTHORIZATION?.trim();

    if (fallbackToken) {
      setAuthToken(fallbackToken);
      appLogger.error('Application failed', { reason: error.message });
    }

    process.stderr.write(`Application failed: ${error.message}\n`);
    process.exit(1);
  }
}

main();
