# Mission Tracker — UPSC Discipline Planner

Mobile-first daily/weekly/monthly task tracker for UPSC prep. Assign time-blocked tasks,
mark them done, and see your consistency % automatically — no manual copy needed.

## Features
- **Today**: time-blocked tasks for the day + Discipline Ring (live completion %) + streak counter
- **Week**: 7-day consistency bars, studied vs wasted days
- **Month**: calendar heatmap (green = high consistency, red = low, grey = no plan)
- **Report**: 30-day performance audit, subject-wise breakdown, JSON backup export/import
- All data stored locally in the browser (localStorage) — nothing leaves your device
- Export/Import JSON backup so you can move data between devices manually

## Run locally

```bash
npm install
npm run dev
```

Open the printed localhost URL on your phone (same wifi) or in your browser.

## Deploy to Vercel

1. Push this folder to a GitHub repo (or use `vercel` CLI directly from this folder)
2. Go to vercel.com → New Project → import the repo
3. Framework preset: **Vite** (auto-detected). Build command `npm run build`, output `dist` — already set in `vercel.json`
4. Deploy. Open the URL on your phone and **Add to Home Screen** for an app-like feel

Or via CLI:
```bash
npm i -g vercel
vercel
```

## Important note on data
Data lives in the browser's localStorage of whichever device/browser you use.
It does **not** sync across devices automatically. Use **Report → Export backup**
regularly, and **Import backup** on another device if you switch phones/browsers.
