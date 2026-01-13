# Costs Service

Costs service for the Cost Manager application.

**Note**: While most users use the Transactions service for managing expenses and income, the Costs service is maintained as part of the original project requirements.

## Port
3001

## Endpoints

- `POST /api/add` - Create a new cost entry

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `PORT_COSTS` - Port number (default: 3001)
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

## API Endpoints

### POST /api/add
Create a new cost entry.

**Request Body:**
```json
{
  "description": "Grocery shopping",
  "category": "food",
  "userid": 1,
  "sum": 450,
  "currency": "ILS",
  "payment_method": "credit_card",
  "created_at": "2025-01-15T12:00:00.000Z"
}
```

**Parameters:**
- `description` (required): Cost description
- `category` (required): One of: food, health, housing, sports, education
- `userid` (required): User ID (1-20)
- `sum` (required): Cost amount (must be positive)
- `currency` (optional, default: "ILS"): One of: ILS, USD, EUR
- `payment_method` (optional): One of: credit_card, cash, bit, check
- `created_at` (optional): Date (cannot be in the past)

