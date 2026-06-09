import { MinHeap } from '../heap/MinHeap';
import type { InboxResult, Notification } from '../types/notification';
import { calculatePriorityScore } from '../utils/priorityScore';
import { Log } from './logService';

interface HeapEntry {
  notification: Notification;
  score: number;
}

export class PriorityInbox {
  private topN: number;
  private processedCount = 0;
  private heap: MinHeap<HeapEntry>;

  constructor(topN: number) {
    this.topN = topN;
    this.heap = new MinHeap((a, b) => a.score - b.score);
    Log('frontend', 'info', 'inbox', `Priority inbox initialised with topN=${topN}`);
  }

  add(notification: Notification): void {
    this.processedCount += 1;

    const score = calculatePriorityScore(notification);
    const entry: HeapEntry = { notification, score };

    if (this.heap.size() < this.topN) {
      this.heap.insert(entry);
      Log('frontend', 'debug', 'heap', `Heap insert, size=${this.heap.size()}`);
      return;
    }

    const lowest = this.heap.peek();

    if (lowest && score > lowest.score) {
      this.heap.removeMin();
      this.heap.insert(entry);
      Log('frontend', 'debug', 'heap', 'Heap eviction and insert');
    }
  }

  getResult(): InboxResult {
    const notifications = this.heap
      .toArray()
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.notification);

    return {
      notifications,
      processedCount: this.processedCount,
      heapSize: this.heap.size(),
      topN: this.topN,
    };
  }
}

export function buildPriorityInbox(
  notifications: Notification[],
  topN: number
): InboxResult {
  const inbox = new PriorityInbox(topN);

  for (const notification of notifications) {
    inbox.add(notification);
  }

  const result = inbox.getResult();
  Log('frontend', 'info', 'inbox', `Priority inbox built: ${result.heapSize}/${result.topN}`);

  return result;
}
