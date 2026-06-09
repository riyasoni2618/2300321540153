export type NotificationType = 'Placement' | 'Result' | 'Event';

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

export interface InboxResult {
  notifications: Notification[];
  processedCount: number;
  heapSize: number;
  topN: number;
}
