# Budgets Service

Budget management service for the Cost Manager application.

## Port
3004

## Endpoints

- `POST /api/budgets` - Create a new budget
- `GET /api/budgets` - Get budgets
- `PUT /api/budgets/:id` - Update a budget
- `DELETE /api/budgets/:id` - Delete a budget
- `GET /api/budgets/status` - Get budget status

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `PORT_BUDGETS` - Port number (default: 3004)
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

