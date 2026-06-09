# Stage 1

## Problem Statement

Campus students receive a continuous stream of notifications across placement drives, exam results, and campus events. Showing every notification is noisy. The product requirement is a **Priority Inbox** that always shows the **Top N** most important unread notifications, where N is configurable (default Top 10).

Priority depends on:

1. Notification type (Placement > Result > Event)
2. Recency (newer notifications outrank older ones within the same type)

The solution must consume a live API, avoid storing the full notification history, and run as a terminal application with no database or frontend. No interactive login UI is built — credentials are supplied via environment variables and the bearer token is obtained from the Test Server auth API.

Notifications are fetched from:

```text
GET http://4.224.186.213/evaluation-service/notifications
```

The API supports `limit`, `page`, and `notification_type` query parameters for filtered and paginated retrieval.

## Priority Strategy

Each notification receives a numeric **priority score**. Higher scores rank higher in the inbox.

The score combines type weight and timestamp into a single comparable value. This avoids multi-pass sorting and keeps ranking logic in a pure utility function separate from API and heap concerns.

## Weight Assignment

| Type | Weight | Rationale |
| ---- | ------ | --------- |
| Placement | 3 | Direct career impact; highest urgency |
| Result | 2 | Academic outcomes; important but secondary to placements |
| Event | 1 | Informational; lowest default urgency |

```js
{
  Placement: 3,
  Result: 2,
  Event: 1
}
```

## Recency Handling

Timestamps are parsed from the API format (`YYYY-MM-DD HH:mm:ss`) and converted to milliseconds since epoch.

The final score is:

```text
score = (weight × RECENCY_MULTIPLIER) + timestampMs
```

`RECENCY_MULTIPLIER` (1e13) is large enough that type weight always dominates, while timestamp still breaks ties within the same type. Two Placement notifications are ordered by recency; a Placement always outranks a Result regardless of timestamp.

## Architecture Diagram

```text
Notification API
        │
        ▼
Notification Service  (HTTP + query params)
        │
        ▼
Priority Calculator  (weight + timestamp score)
        │
        ▼
Min Heap (Top N)
        │
        ▼
Output Formatter
        │
        ▼
Logging Middleware  (all output)
```

**Config** — Loads environment variables with sensible defaults for API URL and Top N.

**Auth Service** — Obtains a bearer token from `POST /evaluation-service/auth` or reads `API_AUTHORIZATION` from the environment.

**Notification Service** — HTTP client only. Builds query strings for `limit`, `page`, and `notification_type`. Sends `Authorization: Bearer <token>` on every request.

**Priority Calculator** — Pure function in `utils/priorityScore.js`. No I/O.

**Min Heap** — Custom implementation in `heap/MinHeap.js`. Maintains the best N notifications seen so far.

**Priority Inbox** — Orchestrates score calculation and heap insert/evict logic.

**Output Formatter** — Formats and emits the final inbox display.

**Logging Middleware** — All application output flows through the custom logger. `console.log` and `console.error` are not used.

## Min Heap Justification

A **min heap** stores the current Top N candidates. The root always holds the *lowest* priority score among those N entries — the weakest link.

Why not sort the full list?

- Sorting M notifications costs O(M log M)
- Storing all notifications uses O(M) memory

With a min heap of size N:

- Each insert/evict is O(log N)
- Memory stays O(N)
- The structure supports a continuous notification stream without reprocessing history

When the heap is full and a new notification arrives:

1. Compare its score against the heap minimum (`peek`)
2. If higher, `removeMin` then `insert`
3. Otherwise discard

This is the standard streaming Top-K pattern and matches the assessment requirement to avoid relying solely on full-array sorting.

## Complexity Analysis

| Operation | Complexity |
| --------- | ---------- |
| Insert | O(log N) |
| Delete | O(log N) |
| Peek | O(1) |
| Memory | O(N) |

For a stream of M notifications, total heap processing is O(M log N). Final display sorts at most N items: O(N log N).

## Scalability Discussion

In production, notifications arrive continuously — potentially thousands per hour across a campus. Re-sorting the entire collection on every new arrival does not scale.

This design processes each notification exactly once:

1. Compute score — O(1)
2. Insert or evict from heap — O(log N)

The heap never grows beyond N entries. Whether 100 or 100,000 notifications arrive, memory and per-notification cost remain constant with respect to stream length.

Paginated API fetching (`limit` + `page`) allows the service to pull large datasets in bounded request sizes without loading everything into memory before processing. Each page is streamed into the heap incrementally.

For Stage 2+, this pattern extends to:

- A background worker polling or subscribing to new notifications
- Per-user Top N heaps in a distributed cache
- Filtered inboxes using `notification_type` at the API layer

## Authentication

Both the notifications API and the logs API are protected.

### Token acquisition

```text
POST http://4.224.186.213/evaluation-service/auth
```

Registration payload (from environment variables):

```json
{
  "email": "<EMAIL>",
  "name": "<NAME>",
  "rollNo": "<ROLL_NO>",
  "accessCode": "<ACCESS_TOKEN>",
  "clientID": "<CLIENT_ID>",
  "clientSecret": "<CLIENT_SECRET>"
}
```

Alternatively, set `API_AUTHORIZATION=Bearer <token>` to skip registration.

### Usage

All protected requests include:

```text
Authorization: Bearer <token>
```

## Logging Middleware Integration

All observability is routed through the custom **Logging Middleware** (`logging middleware/`). Every log is sent to the Test Server:

```text
POST http://4.224.186.213/evaluation-service/logs
Authorization: Bearer <token>
```

### Log signature

```js
Log(stack, level, package, message)
```

Example:

```js
Log('backend', 'info', 'service', 'Fetching notifications')
```

Supported levels (lowercase): `info`, `warn`, `error`, `debug`

### Why remote logging?

The assessment prohibits `console.log`, `console.error`, and built-in language loggers. Logs must be delivered to the Test Server for evaluation.

### Integration points

| Module | Package | Logged events |
| ------ | ------- | ------------- |
| `Application` | `application` | Startup, fetch begin, processing, completion, failures |
| `NotificationService` | `service` | API fetch start, success, failure |
| `PriorityCalculator` | `calculator` | Priority score calculation (debug) |
| `PriorityInbox` | `inbox` | Inbox init, insert, eviction, skipped items |
| `MinHeap` | `heap` | `insert()` and `removeMin()` (debug) |
| `OutputFormatter` | `output` | Final inbox generation |

Set `LOG_LEVEL=DEBUG` to enable heap and priority calculation tracing.

## Future Improvements

- **Redis caching** — Cache the current Top N per user for fast reads
- **Real-time WebSocket updates** — Push new notifications and update the heap in place
- **User-specific weight customization** — Allow students to adjust type priorities
