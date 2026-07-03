# Amrutam App

React Native assignment app — consultations, shop, and health records. Built with Expo, TypeScript, and Zustand.

## Setup

```bash
npm install
npm run generate-data   # run once, creates mock JSON in src/data/
npm start
```

Press `i` for iOS simulator or scan the QR code in Expo Go (SDK 57).

If you hit stale cache issues after pulling changes:

```bash
npx expo start -c
```

## Scripts

| Command | What it does |
|---------|--------------|
| `npm start` | Expo dev server |
| `npm test` | Unit tests |
| `npm run generate-data` | Regenerate doctors/products/records JSON |

## Project layout

```
src/
  modules/          # consultation, shop, health-records — each has screens, services, store
  core/             # api client, storage, sync queue, network check
  design-system/    # theme, Button, SearchBar, Toast
  data/             # chunked JSON (generated, don't edit by hand)
  navigation/       # tab + stack navigators
```

## Notes

- Mock data: 5k doctors, 20k products, 10k health records. Loaded from JSON chunks, paginated in memory.
- Cart and bookings persist via AsyncStorage. Offline bookings go into a sync queue.
- Slot data exists for the first 200 doctors only (full dataset would be too large to bundle).
- Path alias `@/` maps to `src/` — use it for imports from the app root.

## Stack

Expo 57 · React Navigation · Zustand · FlashList · AsyncStorage · Jest
