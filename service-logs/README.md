# Logs Service

Logs service for the Cost Manager application.

## Port
3004

## Endpoints

- `GET /api/logs` - Get all logs

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `PORT_LOGS` - Port number (default: 3007)
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

## Testing

```bash
npm test
```

For test coverage:

```bash
npm run test:coverage
```

