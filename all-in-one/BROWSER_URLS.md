# Browser URLs for Testing

All URLs are for the deployed service on Render. The service uses a gateway that routes all requests through a single port.

Base URL: `https://cost-manager-restful-web-services-u68h.onrender.com`

For local testing, use: `http://localhost:3000` (or the port your service is running on)

## Health Check Endpoint

- **Main Service**: `https://cost-manager-restful-web-services-u68h.onrender.com/`

This will show all available services: users, goals, budgets, transactions, analytics, reports, admin

## Users Service

### GET Requests (Open in Browser)
- **Get all users**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/users`
- **Get user by ID**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/users/1`
- **Get user by ID**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/users/2`
- **Get user by ID**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/users/3`
- **Get user by ID**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/users/4`
- **Get user by ID**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/users/5`
- **Get user by ID**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/users/15` (all users 1-15)
- **Get current user (authenticated)**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/users/me` (requires authentication token)

### POST Requests (Use Postman/cURL)
- **Register new user**: `POST https://cost-manager-restful-web-services-u68h.onrender.com/api/register`
- **Login**: `POST https://cost-manager-restful-web-services-u68h.onrender.com/api/login`
- **Create user**: `POST https://cost-manager-restful-web-services-u68h.onrender.com/api/add`

## Goals Service

### GET Requests (Open in Browser)
- **Get all goals for user 1**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/goals?userid=1`
- **Get all goals for user 2**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/goals?userid=2`
- **Get all goals for user 3**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/goals?userid=3`
- **Get all goals for user 4**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/goals?userid=4`
- **Get all goals for user 5**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/goals?userid=5`
- **Get all goals for user 15**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/goals?userid=15`
- **Get active goals for user 1**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/goals?userid=1&status=active`
- **Get completed goals for user 4**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/goals?userid=4&status=completed`
- **Get goal by ID** (use the _id from the goals list): `https://cost-manager-restful-web-services-u68h.onrender.com/api/goals/69655e6c65b983e0277d0f4a`
- **Get goal progress** (replace :id with actual goal ID): `https://cost-manager-restful-web-services-u68h.onrender.com/api/goals/69655e6c65b983e0277d0f4a/progress`

### POST/PUT/DELETE Requests (Use Postman/cURL)
- **Create goal**: `POST https://cost-manager-restful-web-services-u68h.onrender.com/api/goals`
- **Update goal**: `PUT https://cost-manager-restful-web-services-u68h.onrender.com/api/goals/:id`
- **Delete goal**: `DELETE https://cost-manager-restful-web-services-u68h.onrender.com/api/goals/:id`

## Budgets Service

### GET Requests (Open in Browser)
- **Get all budgets for user 1**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/budgets?userid=1`
- **Get all budgets for user 2**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/budgets?userid=2`
- **Get all budgets for user 3**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/budgets?userid=3`
- **Get all budgets for user 4**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/budgets?userid=4`
- **Get all budgets for user 5**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/budgets?userid=5`
- **Get all budgets for user 15**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/budgets?userid=15`
- **Get budget status for user 1**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/budgets/status?userid=1`
- **Get budget status for user 2**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/budgets/status?userid=2`
- **Get budget status for user 10**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/budgets/status?userid=10`

### POST/PUT/DELETE Requests (Use Postman/cURL)
- **Create budget**: `POST https://cost-manager-restful-web-services-u68h.onrender.com/api/budgets`
- **Update budget**: `PUT https://cost-manager-restful-web-services-u68h.onrender.com/api/budgets/:id`
- **Delete budget**: `DELETE https://cost-manager-restful-web-services-u68h.onrender.com/api/budgets/:id`

## Transactions Service

### POST Requests (Use Postman/cURL)
- **Create transaction**: `POST https://cost-manager-restful-web-services-u68h.onrender.com/api/add`

Body example:
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

## Analytics Service

### GET Requests (Open in Browser)
- **Get analytics for user 1**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/analytics?userid=1`
- **Get analytics for user 2**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/analytics?userid=2`
- **Get analytics for user 3**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/analytics?userid=3`
- **Get analytics for user 15**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/analytics?userid=15`
- **Get analytics summary**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/analytics/summary?userid=1`
- **Get analytics trends**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/analytics/trends?userid=1`
- **Get category breakdown**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/analytics/category?userid=1`
- **Get categories analytics**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/analytics/categories?userid=1`
- **Get monthly summary**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/analytics/monthly?userid=1`
- **Get comparison**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/analytics/comparison?userid=1`
- **Get yearly analytics**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/analytics/yearly?userid=1`

## Report Service

### GET Requests (Open in Browser)
- **Get report for user 1**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/reports?userid=1`
- **Get report for user 2**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/reports?userid=2`
- **Get report for user 15**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/reports?userid=15`
- **Get monthly report for user 1**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/reports?userid=1&month=1&year=2025`
- **Get report (singular)**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/report?userid=1`

## Admin Service

### GET Requests (Open in Browser)
- **Get all logs**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/logs`
- **Get logs by endpoint**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/logs?endpoint=/api/users`
- **Get logs by user**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/logs?userid=1`
- **Get about/team**: `https://cost-manager-restful-web-services-u68h.onrender.com/api/about`

## Database Summary

The database contains:
- **15 users** (IDs 1-15)
- **35 goals** (distributed across all users)
- **270 budgets** (for users 1-15, 3 months, all categories)
- **375 transactions** (income and expenses for all users)
- **100 costs** (legacy cost entries)

## Notes

1. **For POST/PUT/DELETE requests**, you'll need to use tools like:
   - Postman
   - Insomnia
   - cURL
   - Browser extensions (like REST Client)

2. **Local Testing**: If running locally, replace the base URL with `http://localhost:3000` (or your local port)

3. **User IDs**: The seed data creates users with IDs 1-15, so use those IDs in your queries.

4. **Query Parameters**: Some endpoints require query parameters (like `userid`). Make sure to include them in the URL.

5. **All services are accessible through the same base URL** - no need to specify different ports. The gateway service routes requests to the appropriate handlers.

6. **Health Check**: Visit the root URL (`/`) to see all available services and verify the service is running.
