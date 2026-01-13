# Browser URLs for Testing

All URLs are for the deployed service on Render. Replace `https://cost-manager-restful-web-services-u68h.onrender.com` with your local URL if testing locally (e.g., `http://localhost:3000`).

## Health Check Endpoints

### All Services
- **Users Service**: `https://cost-manager-restful-web-services-u68h.onrender.com:3000/`
- **Transactions Service**: `https://cost-manager-restful-web-services-u68h.onrender.com:3007/`
- **Costs Service**: `https://cost-manager-restful-web-services-u68h.onrender.com:3001/`
- **Budgets Service**: `https://cost-manager-restful-web-services-u68h.onrender.com:3004/`
- **Goals Service**: `https://cost-manager-restful-web-services-u68h.onrender.com:3005/`
- **Analytics Service**: `https://cost-manager-restful-web-services-u68h.onrender.com:3006/`
- **Report Service**: `https://cost-manager-restful-web-services-u68h.onrender.com:3002/`
- **Admin Service**: `https://cost-manager-restful-web-services-u68h.onrender.com:3003/`

## Users Service (Port 3000)

### GET Requests (Open in Browser)
- **Get all users**: `https://cost-manager-restful-web-services-u68h.onrender.com:3000/api/users`
- **Get user by ID**: `https://cost-manager-restful-web-services-u68h.onrender.com:3000/api/users/1`
- **Get user by ID**: `https://cost-manager-restful-web-services-u68h.onrender.com:3000/api/users/2`
- **Get user by ID**: `https://cost-manager-restful-web-services-u68h.onrender.com:3000/api/users/3`
- **Get user by ID**: `https://cost-manager-restful-web-services-u68h.onrender.com:3000/api/users/4`
- **Get user by ID**: `https://cost-manager-restful-web-services-u68h.onrender.com:3000/api/users/5`

## Goals Service (Port 3005)

### GET Requests (Open in Browser)
- **Get all goals for user 1**: `https://cost-manager-restful-web-services-u68h.onrender.com:3005/api/goals?userid=1`
- **Get all goals for user 2**: `https://cost-manager-restful-web-services-u68h.onrender.com:3005/api/goals?userid=2`
- **Get all goals for user 3**: `https://cost-manager-restful-web-services-u68h.onrender.com:3005/api/goals?userid=3`
- **Get all goals for user 4**: `https://cost-manager-restful-web-services-u68h.onrender.com:3005/api/goals?userid=4`
- **Get all goals for user 5**: `https://cost-manager-restful-web-services-u68h.onrender.com:3005/api/goals?userid=5`
- **Get active goals for user 1**: `https://cost-manager-restful-web-services-u68h.onrender.com:3005/api/goals?userid=1&status=active`
- **Get completed goals for user 4**: `https://cost-manager-restful-web-services-u68h.onrender.com:3005/api/goals?userid=4&status=completed`
- **Get goal progress (replace :id with actual goal ID)**: `https://cost-manager-restful-web-services-u68h.onrender.com:3005/api/goals/:id/progress`

## Budgets Service (Port 3004)

### GET Requests (Open in Browser)
- **Get all budgets for user 1**: `https://cost-manager-restful-web-services-u68h.onrender.com:3004/api/budgets?userid=1`
- **Get all budgets for user 2**: `https://cost-manager-restful-web-services-u68h.onrender.com:3004/api/budgets?userid=2`
- **Get all budgets for user 3**: `https://cost-manager-restful-web-services-u68h.onrender.com:3004/api/budgets?userid=3`
- **Get all budgets for user 4**: `https://cost-manager-restful-web-services-u68h.onrender.com:3004/api/budgets?userid=4`
- **Get all budgets for user 5**: `https://cost-manager-restful-web-services-u68h.onrender.com:3004/api/budgets?userid=5`
- **Get budget status for user 1**: `https://cost-manager-restful-web-services-u68h.onrender.com:3004/api/budgets/status?userid=1`
- **Get budget status for user 2**: `https://cost-manager-restful-web-services-u68h.onrender.com:3004/api/budgets/status?userid=2`

## Analytics Service (Port 3006)

### GET Requests (Open in Browser)
- **Get analytics for user 1**: `https://cost-manager-restful-web-services-u68h.onrender.com:3006/api/analytics?userid=1`
- **Get analytics for user 2**: `https://cost-manager-restful-web-services-u68h.onrender.com:3006/api/analytics?userid=2`
- **Get analytics for user 3**: `https://cost-manager-restful-web-services-u68h.onrender.com:3006/api/analytics?userid=3`
- **Get category breakdown for user 1**: `https://cost-manager-restful-web-services-u68h.onrender.com:3006/api/analytics/category?userid=1`
- **Get monthly summary for user 1**: `https://cost-manager-restful-web-services-u68h.onrender.com:3006/api/analytics/monthly?userid=1`

## Report Service (Port 3002)

### GET Requests (Open in Browser)
- **Get report for user 1**: `https://cost-manager-restful-web-services-u68h.onrender.com:3002/api/reports?userid=1`
- **Get report for user 2**: `https://cost-manager-restful-web-services-u68h.onrender.com:3002/api/reports?userid=2`
- **Get monthly report for user 1**: `https://cost-manager-restful-web-services-u68h.onrender.com:3002/api/reports?userid=1&month=1&year=2025`

## Admin Service (Port 3003)

### GET Requests (Open in Browser)
- **Get all logs**: `https://cost-manager-restful-web-services-u68h.onrender.com:3003/api/logs`
- **Get logs by endpoint**: `https://cost-manager-restful-web-services-u68h.onrender.com:3003/api/logs?endpoint=/api/users`
- **Get logs by user**: `https://cost-manager-restful-web-services-u68h.onrender.com:3003/api/logs?userid=1`
- **Get system stats**: `https://cost-manager-restful-web-services-u68h.onrender.com:3003/api/stats`

## Notes

1. **For POST/PUT/DELETE requests**, you'll need to use tools like:
   - Postman
   - Insomnia
   - cURL
   - Browser extensions (like REST Client)

2. **Local Testing**: If running locally, replace the URL with `http://localhost:PORT` (e.g., `http://localhost:3000/api/users`)

3. **User IDs**: The seed data creates users with IDs 1-5, so use those IDs in your queries.

4. **Query Parameters**: Some endpoints require query parameters (like `userid`). Make sure to include them in the URL.


