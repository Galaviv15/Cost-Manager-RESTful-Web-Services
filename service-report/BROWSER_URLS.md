# Browser URLs for Testing - Report Service

All URLs are for the deployed service on Render.

Base URL: `https://cost-manager-restful-web-services-report.onrender.com`

For local testing, use: `http://localhost:3002` (or the port your service is running on)

## Health Check Endpoint

- **Service Health**: `https://cost-manager-restful-web-services-report.onrender.com/`

This will show the service status: `{"status":"ok","service":"report","timestamp":"..."}`

## Report Service

### GET Requests (Open in Browser)

#### Get Monthly Report

- **Get report for user 1 (January 2025)**: `https://cost-manager-restful-web-services-report.onrender.com/api/report?id=1&year=2025&month=1`
- **Get report for user 1 (February 2025)**: `https://cost-manager-restful-web-services-report.onrender.com/api/report?id=1&year=2025&month=2`
- **Get report for user 1 (December 2024)**: `https://cost-manager-restful-web-services-report.onrender.com/api/report?id=1&year=2024&month=12`
- **Get report for user 2 (January 2025)**: `https://cost-manager-restful-web-services-report.onrender.com/api/report?id=2&year=2025&month=1`
- **Get report for user 3 (January 2025)**: `https://cost-manager-restful-web-services-report.onrender.com/api/report?id=3&year=2025&month=1`
- **Get report for user 5 (January 2025)**: `https://cost-manager-restful-web-services-report.onrender.com/api/report?id=5&year=2025&month=1`
- **Get report for user 10 (January 2025)**: `https://cost-manager-restful-web-services-report.onrender.com/api/report?id=10&year=2025&month=1`
- **Get report for user 15 (January 2025)**: `https://cost-manager-restful-web-services-report.onrender.com/api/report?id=15&year=2025&month=1`
- **Get report for user 20 (January 2025)**: `https://cost-manager-restful-web-services-report.onrender.com/api/report?id=20&year=2025&month=1`
- **Get report for user 25 (January 2025)**: `https://cost-manager-restful-web-services-report.onrender.com/api/report?id=25&year=2025&month=1`

#### Query Parameters

- `id` (required): User ID (1-25)
- `year` (required): Year (e.g., 2024, 2025)
- `month` (required): Month (1-12)

**Example URL Structure**:
```
https://cost-manager-restful-web-services-report.onrender.com/api/report?id={USER_ID}&year={YEAR}&month={MONTH}
```

#### Report Response

The report includes:
- User information
- Monthly summary (total income, total expenses, balance)
- Category breakdown (expenses and income by category)
- Top expenses
- Budget status (if budgets exist for the month)
- Goals progress (if goals exist)
- Monthly trends and comparisons

## Notes

1. **Query Parameters**: All parameters (`id`, `year`, `month`) are required. Make sure to include them in the URL.

2. **Local Testing**: If running locally, replace the base URL with `http://localhost:3002` (or your local port)

3. **User IDs**: The seed data typically creates users with IDs 1-25, so use those IDs in your queries.

4. **Month Format**: Month should be a number between 1-12 (1 = January, 12 = December)

5. **Year Format**: Year should be a 4-digit number (e.g., 2024, 2025)

6. **Error Responses**: All endpoints return consistent error formats:
   ```json
   {
     "id": "ERROR_TYPE",
     "message": "Error description"
   }
   ```

7. **Health Check**: Visit the root URL (`/`) to verify the service is running.

8. **Authentication**: The endpoint supports optional authentication. If authenticated, the user ID from the token can be used instead of the `id` query parameter.

9. **Cached Reports**: Reports may be cached for better performance. The service automatically generates and caches monthly reports.

10. **Report Data**: Reports aggregate data from multiple sources:
    - Costs (expenses and income)
    - Budgets (if available)
    - Goals (if available)
    - Analytics data

