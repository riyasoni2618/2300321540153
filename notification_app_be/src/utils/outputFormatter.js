import logger from 'logging-middleware';

const outputLogger = logger.child('OutputFormatter');

function buildInboxOutput({ topN, processedCount, heapSize, notifications }) {
  const lines = [];
  const divider = '='.repeat(50);

  lines.push('');
  lines.push(divider);
  lines.push(`PRIORITY INBOX (TOP ${topN})`);
  lines.push(divider);
  lines.push(`Total notifications processed : ${processedCount}`);
  lines.push(`Heap size                   : ${heapSize}`);
  lines.push(`Top N                       : ${topN}`);
  lines.push(divider);

  if (notifications.length === 0) {
    lines.push('');
    lines.push('No notifications to display.');
    lines.push('');
    return lines.join('\n');
  }

  notifications.forEach((notification, index) => {
    lines.push('');
    lines.push(`${index + 1}. [${notification.Type}]`);
    lines.push(`   Message   : ${notification.Message}`);
    lines.push(`   Timestamp : ${notification.Timestamp}`);

    if (index < notifications.length - 1) {
      lines.push('');
      lines.push('---');
    }
  });

  lines.push('');
  return lines.join('\n');
}

export function printPriorityInbox({ topN, processedCount, heapSize, notifications }) {
  outputLogger.info('Generating final priority inbox output');

  const output = buildInboxOutput({
    topN,
    processedCount,
    heapSize,
    notifications,
  });

  process.stdout.write(`${output}\n`);

  outputLogger.info('Priority inbox output complete', {
    displayed: notifications.length,
    topN,
    processedCount,
    heapSize,
  });
}
