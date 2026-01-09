# Costs Service

Costs service for the Cost Manager application (legacy).

## Port
3007

## Endpoints

- `POST /api/add` - Create a new cost entry

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `PORT_COSTS` - Port number (default: 3007)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level

## Installation

```bash
npm install
```

## Running

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

