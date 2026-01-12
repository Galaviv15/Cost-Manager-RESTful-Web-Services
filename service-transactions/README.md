# Transactions Service

Transaction management service for the Cost Manager application.

## Port
3007

## Endpoints

- `POST /api/add` - Create a new transaction (income or expense)

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `PORT_TRANSACTIONS` or `PORT_COSTS` - Port number (default: 3007)
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

