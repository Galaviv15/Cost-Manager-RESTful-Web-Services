# Browser URLs for Testing - Costs Service

All URLs are for the deployed service on Render.

Base URL: `https://cost-manager-restful-web-services-costs.onrender.com`

For local testing, use: `http://localhost:3001` (or the port your service is running on)

## Health Check Endpoint

- **Service Health**: `https://cost-manager-restful-web-services-costs.onrender.com/`

This will show the service status: `{"status":"ok","service":"costs","timestamp":"..."}`

## Costs Service

### GET Requests (Open in Browser)

#### Get All Costs for User
- **Get all costs for user 1**: `https://cost-manager-restful-web-services-costs.onrender.com/api/costs?userid=1`
- **Get all costs for user 2**: `https://cost-manager-restful-web-services-costs.onrender.com/api/costs?userid=2`
- **Get all costs for user 15**: `https://cost-manager-restful-web-services-costs.onrender.com/api/costs?userid=15`
- **Get all costs for user 20**: `https://cost-manager-restful-web-services-costs.onrender.com/api/costs?userid=20`

#### Get Costs with Filters
- **Get expenses only**: `https://cost-manager-restful-web-services-costs.onrender.com/api/costs?userid=1&type=expense`
- **Get income only**: `https://cost-manager-restful-web-services-costs.onrender.com/api/costs?userid=1&type=income`
- **Get costs by category (food)**: `https://cost-manager-restful-web-services-costs.onrender.com/api/costs?userid=1&category=food`
- **Get costs by category (health)**: `https://cost-manager-restful-web-services-costs.onrender.com/api/costs?userid=1&category=health`
- **Get costs by category (salary)**: `https://cost-manager-restful-web-services-costs.onrender.com/api/costs?userid=1&category=salary&type=income`
- **Get recurring costs**: `https://cost-manager-restful-web-services-costs.onrender.com/api/costs?userid=1&recurring=true`
- **Get costs with date range**: `https://cost-manager-restful-web-services-costs.onrender.com/api/costs?userid=1&startDate=2025-01-01&endDate=2025-01-31`
- **Get costs with tags**: `https://cost-manager-restful-web-services-costs.onrender.com/api/costs?userid=1&tags=urgent,important`
- **Get costs with pagination**: `https://cost-manager-restful-web-services-costs.onrender.com/api/costs?userid=1&limit=10&skip=0`

#### Get Cost by ID
- **Get cost by ID** (use the _id from the costs list): `https://cost-manager-restful-web-services-costs.onrender.com/api/costs/69655e6c65b983e0277d0f4a`

**Query Parameters**:
- `userid` (required): User ID (1-25) - or use authentication token
- `type` (optional): Filter by type - "income" or "expense"
- `category` (optional): Filter by category
  - For expenses: food, health, housing, sports, education
  - For income: salary, freelance, investment, business, gift, other
- `startDate` (optional): Start date for date range filter (ISO format: YYYY-MM-DD)
- `endDate` (optional): End date for date range filter (ISO format: YYYY-MM-DD)
- `tags` (optional): Comma-separated list of tags to filter by (e.g., "urgent,important")
- `recurring` (optional): Filter recurring costs - "true" or "false"
- `limit` (optional): Maximum number of results (default: 100)
- `skip` (optional): Number of results to skip for pagination (default: 0)

**Note**: When authenticated (using token), `userid` is optional and will use the authenticated user's ID.

### POST Requests (Use Postman/cURL)

#### Create Cost (Expense)
**URL**: `POST https://cost-manager-restful-web-services-costs.onrender.com/api/add`

**Body**:
```json
{
  "type": "expense",
  "description": "Grocery shopping",
  "category": "food",
  "userid": 1,
  "sum": 450,
  "currency": "ILS",
  "payment_method": "credit_card"
}
```

#### Create Cost (Income)
**URL**: `POST https://cost-manager-restful-web-services-costs.onrender.com/api/add`

**Body**:
```json
{
  "type": "income",
  "description": "Salary",
  "category": "salary",
  "userid": 1,
  "sum": 10000,
  "currency": "ILS"
}
```

#### Create Cost (with Authentication Token)
**URL**: `POST https://cost-manager-restful-web-services-costs.onrender.com/api/add`
**Headers**: `Authorization: Bearer YOUR_TOKEN_HERE`

**Body** (userid is optional when using token):
```json
{
  "type": "expense",
  "description": "Restaurant dinner",
  "category": "food",
  "sum": 200,
  "currency": "ILS",
  "payment_method": "credit_card"
}
```

#### Create Cost with Tags
**URL**: `POST https://cost-manager-restful-web-services-costs.onrender.com/api/add`

**Body**:
```json
{
  "type": "expense",
  "description": "Gym membership",
  "category": "sports",
  "userid": 1,
  "sum": 200,
  "currency": "ILS",
  "payment_method": "credit_card",
  "tags": ["fitness", "monthly", "important"]
}
```

#### Create Recurring Cost
**URL**: `POST https://cost-manager-restful-web-services-costs.onrender.com/api/add`

**Body**:
```json
{
  "type": "expense",
  "description": "Monthly rent",
  "category": "housing",
  "userid": 1,
  "sum": 3000,
  "currency": "ILS",
  "payment_method": "credit_card",
  "recurring": {
    "enabled": true,
    "frequency": "monthly",
    "next_date": "2025-02-01"
  }
}
```

#### Create Cost with Future Date
**URL**: `POST https://cost-manager-restful-web-services-costs.onrender.com/api/add`

**Body**:
```json
{
  "type": "expense",
  "description": "Planned vacation",
  "category": "other",
  "userid": 1,
  "sum": 5000,
  "currency": "ILS",
  "payment_method": "credit_card",
  "created_at": "2025-06-15"
}
```

### Expense Categories Examples

#### Food
```json
{
  "type": "expense",
  "description": "Restaurant dinner",
  "category": "food",
  "userid": 1,
  "sum": 150,
  "currency": "ILS",
  "payment_method": "credit_card"
}
```

#### Health
```json
{
  "type": "expense",
  "description": "Doctor visit",
  "category": "health",
  "userid": 1,
  "sum": 300,
  "currency": "ILS",
  "payment_method": "cash"
}
```

#### Housing
```json
{
  "type": "expense",
  "description": "Electricity bill",
  "category": "housing",
  "userid": 1,
  "sum": 450,
  "currency": "ILS",
  "payment_method": "credit_card"
}
```

#### Sports
```json
{
  "type": "expense",
  "description": "Gym membership",
  "category": "sports",
  "userid": 1,
  "sum": 200,
  "currency": "ILS",
  "payment_method": "credit_card"
}
```

#### Education
```json
{
  "type": "expense",
  "description": "Online course",
  "category": "education",
  "userid": 1,
  "sum": 500,
  "currency": "ILS",
  "payment_method": "credit_card"
}
```

### Income Categories Examples

#### Salary
```json
{
  "type": "income",
  "description": "Monthly salary",
  "category": "salary",
  "userid": 1,
  "sum": 10000,
  "currency": "ILS"
}
```

#### Freelance
```json
{
  "type": "income",
  "description": "Freelance project payment",
  "category": "freelance",
  "userid": 1,
  "sum": 3000,
  "currency": "ILS"
}
```

#### Investment
```json
{
  "type": "income",
  "description": "Stock dividends",
  "category": "investment",
  "userid": 1,
  "sum": 500,
  "currency": "ILS"
}
```

#### Business
```json
{
  "type": "income",
  "description": "Business revenue",
  "category": "business",
  "userid": 1,
  "sum": 5000,
  "currency": "ILS"
}
```

#### Gift
```json
{
  "type": "income",
  "description": "Birthday gift",
  "category": "gift",
  "userid": 1,
  "sum": 200,
  "currency": "ILS"
}
```

#### Other
```json
{
  "type": "income",
  "description": "Cashback refund",
  "category": "other",
  "userid": 1,
  "sum": 100,
  "currency": "ILS"
}
```

## Complete Field Reference

### Required Fields
- `type` (required): Either "income" or "expense"
- `description` (required): Cost description
- `category` (required): 
  - For expenses: food, health, housing, sports, education
  - For income: salary, freelance, investment, business, gift, other
- `userid` (required if no token): User ID (1-25)
- `sum` (required): Cost amount (must be positive)

### Optional Fields
- `currency` (optional, default: "ILS"): One of: ILS, USD, EUR
- `payment_method` (optional, only for expenses): One of: credit_card, cash, bit, check
- `tags` (optional): Array of strings for categorization (e.g., ["urgent", "important"])
- `recurring` (optional): Object with:
  - `enabled` (boolean): Whether this is a recurring cost
  - `frequency` (required if enabled): One of: daily, weekly, monthly, yearly
  - `next_date` (required if enabled): Next occurrence date (ISO format: YYYY-MM-DD)
- `created_at` (optional): Date in ISO format (cannot be in the past, default: current date)

## Notes

1. **For POST requests**, you'll need to use tools like:
   - Postman
   - Insomnia
   - cURL
   - Browser extensions (like REST Client)

2. **Local Testing**: If running locally, replace the base URL with `http://localhost:3001` (or your local port)

3. **User IDs**: The seed data typically creates users with IDs 1-25, so use those IDs in your queries.

4. **Authentication**: When authenticated (using token), `userid` is optional and will use the authenticated user's ID from the token.

5. **Date Validation**: The `created_at` field cannot be in the past. If not provided, it defaults to the current date/time.

6. **Payment Method**: Only allowed for expenses, not for income.

7. **Error Responses**: All endpoints return consistent error formats:
   ```json
   {
     "id": "ERROR_TYPE",
     "message": "Error description"
   }
   ```

8. **Health Check**: Visit the root URL (`/`) to verify the service is running.

9. **Viewing Costs**: Use the GET `/api/costs` endpoint to retrieve costs with various filters. For aggregated data and reports, you can also use:
   - Analytics service (for aggregated data)
   - Reports service (for monthly reports)
   - All-in-one service (for full API access)

10. **Recurring Costs**: When creating a recurring cost, make sure to provide:
    - `recurring.enabled: true`
    - `recurring.frequency`: daily, weekly, monthly, or yearly
    - `recurring.next_date`: The next occurrence date (ISO format)

