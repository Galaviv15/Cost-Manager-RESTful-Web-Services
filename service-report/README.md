# Report Service

Report generation service for the Cost Manager application. Implements the Computed Design Pattern with caching for past months.

## Port
3002

## Endpoints

- `GET /api/report?id={userid}&year={year}&month={month}` - Get monthly report

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `PORT_REPORT` - Port number (default: 3002)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level
- `JWT_SECRET` - JWT secret key (for optional authentication)

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

