# Velmora

Frontend for [baginy.kr](https://baginy.kr), a luggage and travel-bag store. React with Redux Toolkit,
talking to the Velmora API over REST and Socket.IO.

**Live:** [baginy.kr](https://baginy.kr) · **Backend:** [baginy](https://github.com/gaspiralli97/baginy)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| State | Redux Toolkit |
| UI | Material UI 5 + MUI Joy + styled-components |
| Routing | React Router |
| Data | Axios |
| Real-time | socket.io-client |
| Extras | Swiper (carousels), SweetAlert2 (dialogs) |

## Screens

| Route | What it does |
|---|---|
| Home | Featured collections, new arrivals, carousels |
| Products | Catalogue with filtering and sorting |
| Orders | Order history and status |
| User | Profile, settings, saved details |
| Help | FAQ and contact |

## Getting Started

```bash
git clone https://github.com/gaspiralli97/baginy-react.git
cd baginy-react
npm install
cp .env.example .env
npm start
```

Set `REACT_APP_API_URL` to a running Velmora API. The app opens on
`http://localhost:3000`.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Development server |
| `npm run build` | Production build |
| `npm run start:prod` | Serve the build |

## Project Layout

```
src/
  app/
    screens/     one folder per screen
    components/  shared UI
  lib/
    types/       API response types
    enums/       shared enums, mirrored from the API
  css/           global styles
```
