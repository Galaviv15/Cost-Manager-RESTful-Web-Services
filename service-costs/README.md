# Costs Service

Cost management service for the Cost Manager application.

## Port
3001

## Endpoints

- `POST /api/add` - Create a new cost (income or expense)
- `GET /api/report` - Get monthly report (implements Computed Design Pattern)
- `GET /api/costs` - Get costs with filters
- `GET /api/costs/:id` - Get cost by ID

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `PORT_COSTS` - Port number (default: 3001)
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

