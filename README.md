# Historiska platsannonser — frontend

Omarbetad webbklient för att utforska **historiska platsannonser** som tidigare publicerats via Arbetsförmedlingen (t.ex. Platsbanken), utifrån **öppna data**. Applikationen följer Arbetsförmedlingens designsystem **Digi** (`@designsystem-se/af`) för ett konsekvent och tillgängligt gränssnitt.

> **OBS:** Detta repo innehåller bara frontend. API-anrop går mot en separat backend.

- [Historical Ads Rework Backend](https://github.com/Letssdothiss/historical-ads-frontend-rework-BACKEND)

## Funktioner (översikt)

- **Platsannonser** — sökformulär med filter (fritext, geografi, yrkesområden m.m.), resultatlista och relaterad logik under `src/features/jobAds/`.
- **Statistik** — diagram, filter och dataflöde under `src/features/statistics/` (kopplad till er statistik-API).
- **Gemensamt skal** — startsida med blå “shell”, fliknavigering och layoutkomponenter under `src/shared/` och `src/pages/`.

## Teknikstack

| Område  | Val                                                                                                                           |
| ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| UI      | React 19, Vite 8                                                                                                              |
| Routing | React Router 7                                                                                                                |
| Design  | [Digi — Arbetsförmedlingen](https://designsystem.arbetsformedlingen.se/) (`@designsystem-se/af`, `@designsystem-se/af-react`) |
| HTTP    | Axios (`src/shared/api/httpClient.js`)                                                                                        |
| Tester  | Vitest, Testing Library                                                                                                       |
| Övrigt  | `@taxonomy/yrkesvaljaren` (yrkesdata där det används)                                                                         |

## Kom igång

```bash
npm install
npm run dev
```

Applikationen startar normalt på [http://localhost:5173](http://localhost:5173).

### Miljövariabler

Backend-adress styrs av **`VITE_BASE_URL`** (se `src/shared/api/httpClient.js`). Standard om variabel saknas: `http://localhost:5000`.

Kopiera `.env.example` till `.env.local` och justera vid behov.

## NPM-skript

| Kommando               | Beskrivning                |
| ---------------------- | -------------------------- |
| `npm run dev`          | Utvecklingsserver med HMR  |
| `npm run build`        | Produktionsbygge           |
| `npm run preview`      | Förhandsvisning av bygge   |
| `npm run lint`         | ESLint                     |
| `npm run format`       | Prettier (skriv över)      |
| `npm run format:check` | Prettier (endast kontroll) |
| `npm run test`         | Vitest (watch)             |
| `npm run test:run`     | Vitest en gång             |

## Projektstruktur (förenklad)

```
src/
  app/           # App-shell, router, layout
  pages/         # Sidor (t.ex. startsida)
  features/
    jobAds/      # Platsannonser: formulär, filter, API, hooks
    statistics/  # Statistik: formulär, diagram, API, hooks
  shared/        # Återanvända komponenter, httpClient, hooks, utils, global CSS
  assets/
```

Nya UI-delar placeras gärna som **egen mapp per komponent** (`Komponentnamn/Komponentnamn.jsx` + `.css`).

## API mot backend

`jobAdsApi` (`src/features/jobAds/api/jobAdsApi.js`) anropar bland annat:

- `GET /search` — sökning
- `GET /search/ad/:id` — annonsdetalj
- `GET /filters` — filtermetadata
- `GET /export` — export
- `GET /share-url` — delningslänk

Exakta URL-prefix och version (`/api/v1` m.m.) beror på hur backend är monterad; sätt `VITE_BASE_URL` därefter.

## Data och ansvar

Öppna data och presentation av historiska annonser ska följas av **källhänvisning** och respekt för Arbetsförmedlingens villkor för den aktuella datamängden. Detta repo beskriver inte själva datasetet; se er produktdokumentation eller datakatalog.

## Länkar

- [Digi — komponenter och riktlinjer](https://designsystem.arbetsformedlingen.se/)
- [Vite — dokumentation](https://vite.dev/)
- [React — dokumentation](https://react.dev/)

## License, Apache v.2.0

- [Apache License 2.0](./LICENSE)
