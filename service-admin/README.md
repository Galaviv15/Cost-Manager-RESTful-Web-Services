# Admin Service

Admin service for the Cost Manager application.

## Port
3003

## Endpoints

- `GET /api/about` - Get team members information
- `GET /api/logs` - Get all logs

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `PORT_ADMIN` - Port number (default: 3003)
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

