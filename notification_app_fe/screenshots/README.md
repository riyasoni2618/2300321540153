# Frontend Screenshots

Capture the following for submission:

1. **Desktop view** — browser at full width (≥ 1200px)
2. **Mobile view** — Chrome DevTools device toolbar (e.g. iPhone 14, 390px width)

## How to capture

```bash
cd notification_app_fe
npm install
cp .env.example .env
# Set VITE_API_AUTHORIZATION in .env
npm run dev
```

Open `http://localhost:5173` and take screenshots showing:

- Priority Inbox with Top N notifications
- Stats (Processed, Heap Size, Top N, Displayed)
- Type filter and Top N selector

Save as:

- `desktop-priority-inbox.png`
- `mobile-priority-inbox.png`
