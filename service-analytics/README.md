# Analytics Service

Analytics service for the Cost Manager application.

## Port
3006

## Endpoints

- `GET /api/analytics/summary` - Get overall financial summary
- `GET /api/analytics/trends` - Get monthly trends
- `GET /api/analytics/categories` - Get category breakdown
- `GET /api/analytics/comparison` - Get month-over-month comparison
- `GET /api/analytics/yearly` - Get yearly report

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `PORT_ANALYTICS` - Port number (default: 3006)
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

