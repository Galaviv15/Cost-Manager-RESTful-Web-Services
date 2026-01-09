# Goals Service

Goals management service for the Cost Manager application.

## Port
3005

## Endpoints

- `POST /api/goals` - Create a new goal
- `GET /api/goals` - Get goals
- `PUT /api/goals/:id` - Update a goal
- `DELETE /api/goals/:id` - Delete a goal
- `GET /api/goals/:id/progress` - Get goal progress

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `PORT_GOALS` - Port number (default: 3005)
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

