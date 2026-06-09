import logger from 'logging-middleware';
import MinHeap from '../heap/MinHeap.js';
import { calculatePriorityScore } from '../utils/priorityScore.js';

const inboxLogger = logger.child('PriorityInbox');

export class PriorityInbox {
  constructor(topN) {
    if (!Number.isInteger(topN) || topN <= 0) {
      throw new Error('topN must be a positive integer');
    }

    this.topN = topN;
    this.processedCount = 0;
    this.heap = new MinHeap((a, b) => a.score - b.score);

    inboxLogger.info('Priority inbox initialised', { topN });
  }

  add(notification) {
    this.processedCount += 1;

    const score = calculatePriorityScore(notification);
    const entry = { notification, score };

    if (this.heap.size() < this.topN) {
      this.heap.insert(entry);
      inboxLogger.debug('Notification added to heap', {
        id: notification.ID,
        type: notification.Type,
        heapSize: this.heap.size(),
      });
      return;
    }

    const lowest = this.heap.peek();

    if (score > lowest.score) {
      const removed = this.heap.removeMin();
      this.heap.insert(entry);

      inboxLogger.debug('Heap eviction and insert', {
        evictedId: removed.notification.ID,
        insertedId: notification.ID,
        heapSize: this.heap.size(),
      });
      return;
    }

    inboxLogger.debug('Notification skipped — below Top N threshold', {
      id: notification.ID,
      type: notification.Type,
      score,
    });
  }

  getTopNotifications() {
    return this.heap
      .toArray()
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.notification);
  }

  getHeapSize() {
    return this.heap.size();
  }

  getProcessedCount() {
    return this.processedCount;
  }
}
