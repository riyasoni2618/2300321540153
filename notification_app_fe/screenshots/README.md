# Frontend Screenshots

Captured screenshots of the Priority Inbox UI.

| File | Description |
| ---- | ----------- |
| [`desktop-priority-inbox.png`](desktop-priority-inbox.png) | Desktop view (1440px width) |
| [`mobile-priority-inbox.png`](mobile-priority-inbox.png) | Mobile view (iPhone 14, 390px) |

## How to re-capture

```bash
cd notification_app_fe
npm install
cp .env.example .env
# Set VITE_API_AUTHORIZATION in .env
npm run dev
```

Open `http://localhost:5173` and capture:

- Priority Inbox with Top N notifications
- Stats (Processed, Heap Size, Top N, Displayed)
- Type filter and Top N selector
