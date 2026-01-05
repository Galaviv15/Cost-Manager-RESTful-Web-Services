# Cost Manager RESTful Web Service

A comprehensive Node.js/Express/MongoDB RESTful API for managing expenses and generating monthly reports.

## Project Structure

```
├── models/                 # Mongoose schemas
│   ├── User.js
│   ├── Cost.js
│   └── Report.js
├── app_users.js           # User management microservice
├── app_costs.js           # Cost management microservice
├── app_report.js          # Report generation microservice
├── app_admin.js           # Admin/team information microservice
├── database.js            # MongoDB connection
├── package.json
├── .env                   # Environment variables (update with your MongoDB URI)
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Update `.env` file with your MongoDB Atlas connection string:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cost_manager
PORT_USERS=3000
PORT_COSTS=3001
PORT_REPORT=3002
PORT_ADMIN=3003
NODE_ENV=development
```

### 3. Start the Services

You can run each service in a separate terminal:

```bash
# Terminal 1: User Management Service
npm run start:users

# Terminal 2: Cost Management Service
npm run start:costs

# Terminal 3: Report Generation Service
npm run start:report

# Terminal 4: Admin Service
npm run start:admin
```

## API Endpoints

### User Management Service (Port 3000)

#### Create User
```
POST /api/add
Content-Type: application/json

{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "birthday": "1990-05-15",
  "email": "john@example.com",
  "phone_number": "050-1234567"
}
```

#### Get User with Total Costs
```
GET /api/users/:id
```

### Cost Management Service (Port 3001)

#### Create Cost Entry
```
POST /api/add
Content-Type: application/json

{
  "description": "Lunch at restaurant",
  "category": "food",
  "userid": 1,
  "sum": 85.50,
  "currency": "ILS",
  "payment_method": "credit_card"
}
```

Categories: `food`, `health`, `housing`, `sports`, `education`
Currencies: `ILS`, `USD`, `EUR`
Payment Methods: `credit_card`, `cash`, `bit`, `check`

### Report Generation Service (Port 3002)

#### Get Monthly Report
```
GET /api/report?userid=1&year=2025&month=12
```

**Computed Design Pattern:**
- **Past Month**: Returns cached report if available, otherwise generates, caches, and returns
- **Current Month**: Always calculates fresh data (not cached)

### Admin Service (Port 3003)

#### Get Project Information & Team
```
GET /api/about
```

## Database Schemas

### User Collection
- `id` (Number, Unique): Custom user ID
- `first_name` (String, Required)
- `last_name` (String, Required)
- `birthday` (Date, Required)
- `email` (String, Unique, Required)
- `phone_number` (String): Format: XXX-XXXXXXX

### Cost Collection
- `description` (String, Required)
- `category` (String, Required, Enum)
- `userid` (Number, Required): References User.id
- `sum` (Number, Required, Min: 0)
- `created_at` (Date, Default: now)
- `currency` (String, Default: 'ILS', Enum)
- `payment_method` (String, Enum)

### Report Collection
- `userid` (Number, Required)
- `year` (Number, Required)
- `month` (Number, Required)
- `data` (Object): Cached report grouped by category
- `saved_at` (Date, Default: now)

## Logging

All requests and errors are logged using **Pino** logger with structured JSON output for easy parsing and analysis.

## Technologies

- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Logging**: Pino
- **Environment**: dotenv

## Development

For development with auto-reload:

```bash
npm run dev
```

(Requires nodemon to be installed)

## License

ISC
