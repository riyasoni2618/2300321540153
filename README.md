# Campus Notification System

Technical assessment submission for the **Campus Priority Inbox** — a system that surfaces the Top N most important unread campus notifications using a custom min heap.

| | |
| --- | --- |
| **GitHub Repository** | [riyasoni2618/2300321540153](https://github.com/riyasoni2618/2300321540153) |
| **Roll Number** | 2300321540153 |
| **Candidate** | Riya Soni |

---

## Repository Structure

```text
├── logging middleware/          # Custom logging middleware (mandatory)
├── Notification_System_Design.md
├── notification_app_be/         # Stage 1 backend (Node.js)
├── notification_app_fe/         # Frontend (React + TypeScript + MUI)
└── .gitignore
```

| Path | Description |
| ---- | ----------- |
| [`logging middleware/`](logging%20middleware/) | Sends all logs to the Test Server Log API |
| [`Notification_System_Design.md`](Notification_System_Design.md) | Architecture, priority strategy, complexity analysis |
| [`notification_app_be/`](notification_app_be/) | Stage 1 terminal Priority Inbox (Node.js) |
| [`notification_app_fe/`](notification_app_fe/) | Web UI for Priority Inbox (React + MUI) |

---

## API Endpoints (Test Server)

| Endpoint | Method | Purpose |
| -------- | ------ | ------- |
| `http://4.224.186.213/evaluation-service/auth` | POST | Obtain bearer token |
| `http://4.224.186.213/evaluation-service/notifications` | GET | Fetch notifications (`limit`, `page`, `notification_type`) |
| `http://4.224.186.213/evaluation-service/logs` | POST | Remote logging (via logging middleware) |

---

## Priority Rules

1. **Placement** — highest priority
2. **Result** — medium priority
3. **Event** — lowest priority

Within the same type, newer notifications rank higher. A custom **min heap** maintains the Top N items in **O(log N)** per insert.

---

## Quick Start — Backend (Stage 1)

```bash
cd notification_app_be
npm install
cp .env.example .env
# Set API_AUTHORIZATION or auth credentials in .env
npm start
```

See [`notification_app_be/README.md`](notification_app_be/README.md) for full setup.

### Backend Output

Terminal output showing the Top 10 Priority Inbox:

[`notification_app_be/screenshots/example-output.txt`](notification_app_be/screenshots/example-output.txt)

---

## Quick Start — Frontend

```bash
cd notification_app_fe
npm install
cp .env.example .env
# Set VITE_API_AUTHORIZATION=Bearer <your-token>
npm run dev
```

Open **http://localhost:5173** — API calls are proxied to the Test Server via Vite.

See [`notification_app_fe/README.md`](notification_app_fe/README.md) for details.

### Frontend Screenshots

**Desktop view** (1440px):

![Desktop Priority Inbox](notification_app_fe/screenshots/desktop-priority-inbox.png)

**Mobile view** (iPhone 14):

![Mobile Priority Inbox](notification_app_fe/screenshots/mobile-priority-inbox.png)

---

## Logging Middleware

All application output uses the custom logging middleware — **no `console.log` or `console.error`**.

```js
Log('backend', 'info', 'service', 'Fetching notifications')
Log('frontend', 'info', 'ui', 'Inbox loaded')
```

Logs are posted to `http://4.224.186.213/evaluation-service/logs`.

See [`logging middleware/README.md`](logging%20middleware/README.md).

---

## Authentication

Protected APIs require a bearer token from the auth endpoint. Configure in `.env`:

```env
API_AUTHORIZATION=Bearer <token>
```

Or register with assessment credentials (`CLIENT_ID`, `CLIENT_SECRET`, `ACCESS_TOKEN`, `EMAIL`, `NAME`, `ROLL_NO`).

---

## Stage 1 Deliverables

- [x] Working backend in `notification_app_be/`
- [x] Terminal output sample in `notification_app_be/screenshots/`
- [x] System design document at repository root
- [x] Logging middleware integration
- [x] Frontend Priority Inbox UI in `notification_app_fe/`
- [x] Desktop and mobile screenshots in `notification_app_fe/screenshots/`

---

## Documentation

- [System Design](Notification_System_Design.md) — problem statement, architecture, min heap, complexity
- [Backend README](notification_app_be/README.md) — env vars, run instructions
- [Frontend README](notification_app_fe/README.md) — React app setup and build
